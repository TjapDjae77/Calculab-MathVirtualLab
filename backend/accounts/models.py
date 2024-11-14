from datetime import timedelta
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    score = models.PositiveIntegerField(default=0)
    level_completed = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.user.username} Profile'
