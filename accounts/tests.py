from datetime import timedelta
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core import mail
from django.test import override_settings
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APITestCase

from .tokens import email_verification_token
from .views import RESEND_VERIFICATION_RESPONSE


class PasswordResetConfirmViewTests(APITestCase):
    def setUp(self):
        self.user_model = get_user_model()
        self.user = self.user_model.objects.create_user(
            username="alice",
            email="alice@example.com",
            password="old-password-123",
            is_active=True,
        )
        self.url = reverse("password-reset-confirm")

    def test_resets_password_with_username(self):
        response = self.client.post(
            self.url,
            {"username": "alice", "new_password": "new-password-123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("new-password-123"))

    def test_returns_400_for_unknown_username(self):
        response = self.client.post(
            self.url,
            {"username": "unknown", "new_password": "new-password-123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Invalid username")


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    FRONTEND_URL="http://localhost:5173",
)
class EmailVerificationFlowTests(APITestCase):
    def setUp(self):
        self.user_model = get_user_model()
        self.register_url = reverse("register")
        self.verify_url = reverse("verify-email")
        self.resend_url = reverse("resend-verification-email")
        self.login_url = "/api/auth/login/"

    def test_registration_sends_verification_email_and_creates_inactive_user(self):
        response = self.client.post(
            self.register_url,
            {
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "strong-pass-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = self.user_model.objects.get(username="newuser")
        self.assertFalse(user.is_active)

        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assertEqual(email.to, ["newuser@example.com"])
        self.assertEqual(email.from_email, "xxmirndaxx@gmail.com")
        self.assertIn("Activate your InnerLog account", email.subject)
        self.assertIn("Verify email address", email.alternatives[0][0])
        self.assertIn("/verify-email?uid=", email.body)
        self.assertIn("token=", email.body)

    def test_verification_activates_user(self):
        user = self.user_model.objects.create_user(
            username="inactive-user",
            email="inactive@example.com",
            password="strong-pass-123",
            is_active=False,
        )
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = email_verification_token.make_token(user)

        response = self.client.post(
            self.verify_url,
            {"uid": uid, "token": token},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["code"], "verified")

        user.refresh_from_db()
        self.assertTrue(user.is_active)

    def test_already_verified_user_gets_success_response(self):
        user = self.user_model.objects.create_user(
            username="active-user",
            email="active@example.com",
            password="strong-pass-123",
            is_active=True,
        )
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        response = self.client.post(
            self.verify_url,
            {"uid": uid, "token": "any-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["code"], "already_verified")

    @override_settings(PASSWORD_RESET_TIMEOUT=0)
    def test_expired_token_returns_expired_code(self):
        user = self.user_model.objects.create_user(
            username="expired-user",
            email="expired@example.com",
            password="strong-pass-123",
            is_active=False,
        )
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = email_verification_token.make_token(user)

        current_time = email_verification_token._now()
        with patch("accounts.tokens.email_verification_token._now", return_value=current_time + timedelta(seconds=1)):
            response = self.client.post(
                self.verify_url,
                {"uid": uid, "token": token},
                format="json",
            )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "expired_token")

    def test_resend_verification_email_sends_for_inactive_user(self):
        self.user_model.objects.create_user(
            username="inactive-resend",
            email="inactive-resend@example.com",
            password="strong-pass-123",
            is_active=False,
        )

        response = self.client.post(
            self.resend_url,
            {"email": "inactive-resend@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, RESEND_VERIFICATION_RESPONSE)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["inactive-resend@example.com"])

    def test_resend_verification_email_does_not_send_for_active_user(self):
        self.user_model.objects.create_user(
            username="active-resend",
            email="active-resend@example.com",
            password="strong-pass-123",
            is_active=True,
        )

        response = self.client.post(
            self.resend_url,
            {"email": "active-resend@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, RESEND_VERIFICATION_RESPONSE)
        self.assertEqual(len(mail.outbox), 0)

    def test_resend_verification_email_does_not_leak_unknown_email(self):
        response = self.client.post(
            self.resend_url,
            {"email": "missing@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, RESEND_VERIFICATION_RESPONSE)
        self.assertEqual(len(mail.outbox), 0)

    def test_inactive_user_cannot_log_in_before_verification(self):
        self.user_model.objects.create_user(
            username="inactive-login",
            email="inactive-login@example.com",
            password="strong-pass-123",
            is_active=False,
        )

        response = self.client.post(
            self.login_url,
            {"username": "inactive-login", "password": "strong-pass-123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
