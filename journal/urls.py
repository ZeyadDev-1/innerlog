from django.urls import path
from .views import MoodEntryListCreateView, MoodEntryDeleteView, ExportMoodDataView

urlpatterns = [
    path('moods/', MoodEntryListCreateView.as_view()),
    path('moods/<int:pk>/', MoodEntryDeleteView.as_view()),
    path('export/', ExportMoodDataView.as_view()),
]