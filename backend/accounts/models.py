from datetime import timedelta
from django.db import models
from django.contrib.auth.models import User
from levels.models import Level

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    score = models.PositiveIntegerField(default=0)
    completed_levels = models.ManyToManyField(Level, blank=True)

    def __str__(self):
        return f'{self.user.username} Profile'
