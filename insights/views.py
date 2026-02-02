from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from journal.models import MoodEntry

class MoodTrendView(APIView):
    def get(self, request):
        entries = MoodEntry.objects.filter(user=request.user).order_by('created_at')

        data = [
            {
                "date": entry.created_at.date(),
                "mood_score": entry.mood_score
            }
            for entry in entries
        ]

        return Response(data)

