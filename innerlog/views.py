from rest_framework.views import APIView
from rest_framework.response import Response
from .privacy import privacy_policy


class PrivacyPolicyView(APIView):
    permission_classes = []

    def get(self, request):
        return Response(privacy_policy())
