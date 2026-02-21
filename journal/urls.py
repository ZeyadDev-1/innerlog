from django.urls import path
from .views import MoodEntryListCreateView, MoodEntryDetailView, ExportMoodDataView

urlpatterns = [
    path("moods/", MoodEntryListCreateView.as_view()),
    path("moods/<int:pk>/", MoodEntryDetailView.as_view()),  # ✅ PATCH/DELETE/GET here
    path("export/", ExportMoodDataView.as_view()),
]