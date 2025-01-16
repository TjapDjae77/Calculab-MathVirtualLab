from django.contrib import admin
from .models import Soal

@admin.register(Soal)
class SoalAdmin(admin.ModelAdmin):
    list_display = ('level', 'question', 'material_input_checker', 'input_function_checker', 'output_material')  # Kolom yang akan ditampilkan
    search_fields = ('question',)  # Kolom pencarian
    list_filter = ('level',)  # Filter berdasarkan level
