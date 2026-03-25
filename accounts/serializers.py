import logging

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .passwords import is_password_used_by_any_user

User = get_user_model()
logger = logging.getLogger(__name__)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class RegisterWithEmailSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_email(self, value):
        normalized_email = value.strip().lower()
        if User.objects.filter(email__iexact=normalized_email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return normalized_email

    def validate_password(self, value):
        candidate_user = User(
            username=self.initial_data.get("username", ""),
            email=self.initial_data.get("email", ""),
        )
        try:
            validate_password(value, user=candidate_user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages)

        if is_password_used_by_any_user(value):
            raise serializers.ValidationError(
                "This password is already in use. Please choose a different password."
            )

        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)

        # IMPORTANT: user inactive until email verified
        user.is_active = False
        user.save()
        return user


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, trim_whitespace=False)


class InnerLogTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        "no_active_account": "Invalid username or password.",
    }

    def validate(self, attrs):
        username = attrs.get(self.username_field)
        password = attrs.get("password")

        user = User.objects.filter(username=username).only("id", "is_active", "password").first()
        if user and not user.is_active and password and user.check_password(password):
            logger.info("Login blocked for inactive user", extra={"user_id": user.id, "username": username})
            raise AuthenticationFailed(
                detail={
                    "code": "email_not_verified",
                    "detail": "Please verify your email before logging in.",
                },
                code="email_not_verified",
            )

        try:
            return super().validate(attrs)
        except AuthenticationFailed:
            logger.warning("Login failed for username", extra={"username": username})
            raise
