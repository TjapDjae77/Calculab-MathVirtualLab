from rest_framework import serializers
from .models import Soal

class SoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Soal
        fields = ['level', 'premise1', 'premise2', 'material_input_checker', 'base_function', 'input_function_checker', 'output_material']  