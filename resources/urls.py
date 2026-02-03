from django.urls import path
from .views import ResourceRecommendationView

urlpatterns = [
    path('recommendations/', ResourceRecommendationView.as_view()),
]