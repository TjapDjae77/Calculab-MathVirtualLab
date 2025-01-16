from django.contrib import admin
from .models import Soal

@admin.register(Soal)
class SoalAdmin(admin.ModelAdmin):
    list_display = ('level', 'premise1', 'premise2', 'material_input_checker', 'base_function', 'input_function_checker', 'output_material')  # Kolom yang akan ditampilkan
    search_fields = ('premise1', 'premise2',)  # Kolom pencarian
    list_filter = ('level', 'base_function',)  # Filter berdasarkan level
