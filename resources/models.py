from django.db import models


class Resource(models.Model):
    RESOURCE_TYPES = [
        ('article', 'Article'),
        ('exercise', 'Exercise'),
        ('prompt', 'Journal Prompt'),
        ('external', 'External Link'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    resource_type = models.CharField(
        max_length=20,
        choices=RESOURCE_TYPES
    )
    url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
