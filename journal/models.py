from django.conf import settings
from django.db import models


class MoodEntry(models.Model):
    MOOD_CHOICES = [
        (1, 'Very low'),
        (2, 'Low'),
        (3, 'Neutral'),
        (4, 'Good'),
        (5, 'Very good'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mood_entries'
    )
    mood_score = models.IntegerField(choices=MOOD_CHOICES)
    journal_text = models.TextField(blank=True)
    emotions = models.CharField(
        max_length=255,
        help_text="Comma-separated emotions (e.g. calm, stressed)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} – Mood {self.mood_score}"
