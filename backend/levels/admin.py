from django.contrib import admin
from .models import Level

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('level_number', 'name', 'description')  # Atribut yang ditampilkan
    search_fields = ('name',)  # Bisa mencari berdasarkan atribut nama level
    list_filter = ('level_number',) # Filter level
