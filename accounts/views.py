import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.utils.encoding import force_bytes, force_str
from django.utils.html import strip_tags
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import (
    InnerLogTokenObtainPairSerializer,
    PasswordResetConfirmSerializer,
    RegisterSerializer,
    RegisterWithEmailSerializer,
)
from .tokens import email_verification_token, password_reset_token

logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = InnerLogTokenObtainPairSerializer


class ProfileView(APIView):
    def get(self, request):
        user = request.user
        return Response({"username": user.username, "email": user.email})


class DeleteAccountView(APIView):
    def delete(self, request):
        user = request.user
        user.delete()
        return Response(
            {"detail": "Account and all associated data deleted."},
            status=status.HTTP_204_NO_CONTENT,
        )


User = get_user_model()
RESEND_VERIFICATION_RESPONSE = {
    "detail": "If an inactive account matches that email, we have sent a new verification email."
}
PASSWORD_RESET_REQUEST_RESPONSE = {
    "detail": "If an account matches that email, we have sent a password reset link."
}


class ResendVerificationEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


def build_verification_email(user, verify_url):
    subject = "Activate your InnerLog account"
    html_message = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <p>Hi {user.username},</p>
        <p>Welcome to <strong>InnerLog</strong>. Please confirm your email address to activate your account and start journaling.</p>
        <p>
          <a
            href="{verify_url}"
            style="display: inline-block; padding: 12px 20px; background: #6f4e37; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;"
          >
            Verify email address
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p><a href="{verify_url}">{verify_url}</a></p>
        <p>If you did not create an InnerLog account, you can safely ignore this email.</p>
        <p>— The InnerLog team</p>
      </body>
    </html>
    """
    text_message = strip_tags(html_message)
    return subject, text_message, html_message


def send_verification_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = email_verification_token.make_token(user)
    verify_url = f"{settings.FRONTEND_URL}/verify-email?uid={uid}&token={token}"
    subject, text_message, html_message = build_verification_email(user, verify_url)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")
    email.send(fail_silently=False)


def build_password_reset_email(user, reset_url):
    subject = "Reset your InnerLog password"
    html_message = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <p>Hi {user.username},</p>
        <p>We received a request to reset your InnerLog password.</p>
        <p>
          <a
            href="{reset_url}"
            style="display: inline-block; padding: 12px 20px; background: #6f4e37; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;"
          >
            Set new password
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p><a href="{reset_url}">{reset_url}</a></p>
        <p>If you did not request this change, you can safely ignore this email.</p>
        <p>— The InnerLog team</p>
      </body>
    </html>
    """
    text_message = strip_tags(html_message)
    return subject, text_message, html_message


def send_password_reset_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = password_reset_token.make_token(user)
    reset_url = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"
    subject, text_message, html_message = build_password_reset_email(user, reset_url)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")
    email.send(fail_silently=False)


def _server_error_response(code, detail, exc):
    logger.exception("Authentication flow error: %s", code, exc_info=exc)
    payload = {"code": code, "detail": detail}
    if settings.DEBUG:
        payload["debug"] = {"root_cause": str(exc)}
    return Response(payload, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterWithEmailView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterWithEmailSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():
                user = serializer.save()
                send_verification_email(user)
        except Exception as exc:
            return _server_error_response(
                "registration_failed",
                "We could not complete sign up right now. Please try again.",
                exc,
            )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        if not uid or not token:
            return Response(
                {
                    "code": "missing_token",
                    "detail": "The verification link is incomplete. Please use the full link from your email.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except Exception as exc:
            logger.warning("Invalid verification uid", extra={"uid": uid, "error": str(exc)})
            return Response(
                {
                    "code": "invalid_uid",
                    "detail": "We could not validate this verification link. Please request a new one.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.is_active:
            return Response(
                {
                    "code": "already_verified",
                    "detail": "This email address is already verified. You can sign in now.",
                }
            )

        token_status = email_verification_token.get_token_status(user, token)
        if token_status == "valid":
            user.is_active = True
            user.save(update_fields=["is_active"])
            return Response(
                {
                    "code": "verified",
                    "detail": "Your email has been verified successfully. You can sign in now.",
                }
            )

        if token_status == "expired":
            return Response(
                {
                    "code": "expired_token",
                    "detail": "This verification link has expired. Please sign up again to receive a new verification email.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.warning("Invalid verification token", extra={"user_id": user.id})
        return Response(
            {
                "code": "invalid_token",
                "detail": "This verification link is invalid. Please check the link in your email or sign up again.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class ResendVerificationEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResendVerificationEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = User.objects.filter(email__iexact=email, is_active=False).first()
        if user:
            try:
                send_verification_email(user)
            except Exception as exc:
                return _server_error_response(
                    "verification_email_send_failed",
                    "We could not send a verification email right now. Please try again.",
                    exc,
                )

        return Response(RESEND_VERIFICATION_RESPONSE)


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = User.objects.filter(email__iexact=email).first()
        if user:
            try:
                send_password_reset_email(user)
            except Exception as exc:
                return _server_error_response(
                    "password_reset_email_send_failed",
                    "We could not process your request right now. Please try again.",
                    exc,
                )

        return Response(PASSWORD_RESET_REQUEST_RESPONSE)


class PasswordResetValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        if not uid or not token:
            return Response(
                {"code": "missing_token", "detail": "The reset link is incomplete."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except Exception as exc:
            logger.warning("Invalid password reset uid", extra={"uid": uid, "error": str(exc)})
            return Response(
                {"code": "invalid_link", "detail": "This reset link is invalid or has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token_status = password_reset_token.get_token_status(user, token)
        if token_status == "valid":
            return Response({"code": "valid", "detail": "Reset link is valid."})

        return Response(
            {"code": "invalid_link", "detail": "This reset link is invalid or has expired."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except Exception as exc:
            logger.warning("Invalid password reset confirm uid", extra={"uid": uid, "error": str(exc)})
            return Response(
                {"code": "invalid_link", "detail": "This reset link is invalid or has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if password_reset_token.get_token_status(user, token) != "valid":
            return Response(
                {"code": "invalid_link", "detail": "This reset link is invalid or has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.check_password(new_password):
            return Response(
                {
                    "code": "password_unchanged",
                    "detail": "Your new password must be different from your current password.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(new_password, user=user)
        except ValidationError as exc:
            return Response({"code": "weak_password", "detail": " ".join(exc.messages)}, status=400)

        try:
            user.set_password(new_password)
            user.save(update_fields=["password"])
        except Exception as exc:
            return _server_error_response(
                "password_reset_failed",
                "We could not reset your password right now. Please try again.",
                exc,
            )

        return Response({"detail": "Password has been reset successfully."})
