from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'get_completed_levels')

    def get_completed_levels(self, obj):
        return ", ".join([str(level.level_number) for level in obj.completed_levels.all()])
    get_completed_levels.short_description = 'Completed Levels'
