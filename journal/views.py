from django.shortcuts import render
from rest_framework import generics
from .models import MoodEntry
from .serializers import MoodEntrySerializer
from rest_framework.views import APIView
from rest_framework.response import Response

class MoodEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = MoodEntrySerializer

    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user)


class MoodEntryDeleteView(generics.DestroyAPIView):
    serializer_class = MoodEntrySerializer

    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user)

class ExportMoodDataView(APIView):
    def get(self, request):
        entries = MoodEntry.objects.filter(user=request.user)

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