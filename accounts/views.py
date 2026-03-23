from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.utils.encoding import force_bytes, force_str
from django.utils.html import strip_tags
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import RegisterSerializer, RegisterWithEmailSerializer
from .tokens import email_verification_token


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class ProfileView(APIView):
    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email
        })


class DeleteAccountView(APIView):
    def delete(self, request):
        user = request.user
        user.delete()
        return Response(
            {"detail": "Account and all associated data deleted."},
            status=status.HTTP_204_NO_CONTENT
        )


User = get_user_model()
RESEND_VERIFICATION_RESPONSE = {
    "detail": "If an inactive account matches that email, we have sent a new verification email."
}


class ResendVerificationEmailSerializer(serializers.Serializer):
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


class RegisterWithEmailView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterWithEmailSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            user = serializer.save()
            send_verification_email(user)


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
        except Exception:
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
            send_verification_email(user)

        return Response(RESEND_VERIFICATION_RESPONSE)


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        new_password = request.data.get("new_password")

        if not username or not new_password:
            return Response({"detail": "username and new_password are required"}, status=400)

        user = User.objects.filter(username=username).first()
        if not user:
            return Response({"detail": "Invalid username"}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({"detail": "Password has been reset successfully."})
