from django.db import models


class Level(models.Model):
    level_number = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Level {self.level_number}: {self.name}"
