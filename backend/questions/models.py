from django.db import models
from levels.models import Level

class Soal(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='soal')
    premise1 = models.TextField(default="")
    premise2 = models.TextField(default="")
    material_input_checker = models.CharField(max_length=50)  # Untuk mengecek input material
    base_function = models.CharField(max_length=10, default="f(x)") # Fungsi yang menjadi pertanyaan (f(x) atau g(x) atau h(x), dsb)
    input_function_checker = models.JSONField() # Untuk mengecek fungsi input
    output_material = models.CharField(max_length=50)  # Output material yang diharapkan

    def __str__(self):
        return f"Soal untuk level {self.level.level_number}"
