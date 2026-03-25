from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.crypto import constant_time_compare
from django.utils.http import base36_to_int


class TimeoutAwareTokenGenerator(PasswordResetTokenGenerator):
    def get_token_status(self, user, token):
        if not user or not token:
            return "invalid"

        try:
            ts_b36, _hash = token.split("-")
            ts = base36_to_int(ts_b36)
        except (TypeError, ValueError):
            return "invalid"

        for secret in [self.secret, *self.secret_fallbacks]:
            if constant_time_compare(
                self._make_token_with_timestamp(user, ts, secret),
                token,
            ):
                age_in_seconds = self._num_seconds(self._now()) - ts
                if age_in_seconds > settings.PASSWORD_RESET_TIMEOUT:
                    return "expired"
                return "valid"

        return "invalid"

email_verification_token = TimeoutAwareTokenGenerator()
password_reset_token = TimeoutAwareTokenGenerator()
