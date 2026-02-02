from django.urls import path
from .views import (
    MoodTrendView,
    WeeklyMoodAverageView,
    MoodDistributionView,
)

urlpatterns = [
    path('trend/', MoodTrendView.as_view()),
    path('weekly-average/', WeeklyMoodAverageView.as_view()),
    path('distribution/', MoodDistributionView.as_view()),
]
