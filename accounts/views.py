from rest_framework import generics, permissions
from .serializers import RegisterSerializer
from .models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

from .serializers import RegisterWithEmailSerializer
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

class RegisterWithEmailView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterWithEmailSerializer

    def perform_create(self, serializer):
        user = serializer.save()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = email_verification_token.make_token(user)

        verify_url = f"{settings.FRONTEND_URL}/verify-email?uid={uid}&token={token}"

        send_mail(
            subject="Verify your InnerLog account",
            message=f"Click to verify your email: {verify_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        if not uid or not token:
            return Response({"detail": "uid and token are required"}, status=400)

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except Exception:
            return Response({"detail": "Invalid uid"}, status=400)

        if email_verification_token.check_token(user, token):
            user.is_active = True
            user.save(update_fields=["is_active"])
            return Response({"detail": "Email verified successfully."})

        return Response({"detail": "Invalid or expired token"}, status=400)