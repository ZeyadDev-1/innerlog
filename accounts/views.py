from rest_framework import generics, permissions
from .serializers import RegisterSerializer
from .models import User
from rest_framework.response import Response
from rest_framework.views import APIView

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