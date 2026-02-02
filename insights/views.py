from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from journal.models import MoodEntry
from django.db.models import Avg
from django.db.models.functions import TruncWeek
from django.db.models import Count

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
class WeeklyMoodAverageView(APIView):
    def get(self, request):
        data = (
            MoodEntry.objects
            .filter(user=request.user)
            .annotate(week=TruncWeek('created_at'))
            .values('week')
            .annotate(avg_mood=Avg('mood_score'))
            .order_by('week')
        )

        return Response(list(data))
    
class MoodDistributionView(APIView):
    def get(self, request):
        data = (
            MoodEntry.objects
            .filter(user=request.user)
            .values('mood_score')
            .annotate(count=Count('id'))
            .order_by('mood_score')
        )

        return Response(list(data))

