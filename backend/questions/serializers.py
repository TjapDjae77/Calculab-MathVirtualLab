from rest_framework import serializers
from .models import Soal

class SoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Soal
        fields = ['level', 'question', 'material_input_checker', 'input_function_checker', 'output_material']  