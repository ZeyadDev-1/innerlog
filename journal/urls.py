from django.urls import path
from .views import MoodEntryListCreateView, MoodEntryDeleteView

urlpatterns = [
    path('moods/', MoodEntryListCreateView.as_view()),
    path('moods/<int:pk>/', MoodEntryDeleteView.as_view()),
]