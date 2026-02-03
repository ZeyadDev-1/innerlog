from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg
from journal.models import MoodEntry
from .models import Resource
from .serializers import ResourceSerializer

class ResourceRecommendationView(APIView):
    def get(self, request):
        user = request.user

        avg_mood = (
            MoodEntry.objects
            .filter(user=user)
            .aggregate(avg=Avg('mood_score'))
            .get('avg')
        )

        queryset = Resource.objects.filter(is_active=True)

        if avg_mood is not None and avg_mood <= 2.5:
            queryset = queryset.filter(resource_type='exercise')
        elif avg_mood is not None and avg_mood >= 4:
            queryset = queryset.filter(resource_type='article')

        serializer = ResourceSerializer(queryset, many=True)
        return Response({
            "average_mood": avg_mood,
            "resources": serializer.data,
            "disclaimer": (
                "These resources are for general well-being support "
                "and are not medical advice."
            )
        })
