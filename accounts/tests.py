from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


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
