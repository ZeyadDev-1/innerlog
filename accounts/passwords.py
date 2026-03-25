from django.contrib.auth import get_user_model

User = get_user_model()


def is_password_used_by_any_user(raw_password, exclude_user_id=None):
    users = User.objects.only("id", "password").iterator()
    for user in users:
        if exclude_user_id is not None and user.id == exclude_user_id:
            continue
        if user.check_password(raw_password):
            return True
    return False
