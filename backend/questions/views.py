from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Soal
from .serializers import SoalSerializer

class SoalListView(APIView):
    def get(self, request):
        levels = Soal.objects.all()
        serializer = SoalSerializer(levels, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SoalDetailView(APIView):
    def get(self, request, pk):
        try:
            soal = Soal.objects.get(pk=pk)
        except Soal.DoesNotExist:
            return Response({'error': 'Soal not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SoalSerializer(soal)
        return Response(serializer.data, status=status.HTTP_200_OK)