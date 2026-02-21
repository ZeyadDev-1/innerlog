from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import MoodEntry
from .serializers import MoodEntrySerializer


class MoodEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = MoodEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user).order_by("-created_at")

    def get_serializer_context(self):
        # Needed so serializer.create() can access request.user
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


# ✅ NEW: supports GET (retrieve), PATCH/PUT (update), DELETE (destroy)
class MoodEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MoodEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user)


class ExportMoodDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entries = MoodEntry.objects.filter(user=request.user).order_by("-created_at")

        data = [
            {
                "date": entry.created_at,
                "mood_score": entry.mood_score,
                "emotions": entry.emotions,
                "journal_text": entry.journal_text,
            }
            for entry in entries
        ]

        return Response({
            "user": request.user.username,
            "entries": data
        })