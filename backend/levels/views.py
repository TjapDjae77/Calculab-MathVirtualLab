from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models import Profile
from .models import Level
from .serializers import LevelSerializer

class LevelListView(APIView):
    def get(self, request):
        levels = Level.objects.all()
        serializer = LevelSerializer(levels, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LevelDetailView(APIView):
    def get(self, request, pk):
        try:
            level = Level.objects.get(pk=pk)
        except Level.DoesNotExist:
            return Response({'error': 'Level not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = LevelSerializer(level)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CompleteLevelView(APIView):
    def post(self, request, level_number):
        user = request.user

        # Memeriksa profile ditemukan atau tidak
        profile = Profile.objects.filter(user=user).first()
        if not profile:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        # Memeriksa level ditemukan atau tidak
        level = Level.objects.filter(level_number=level_number).first()
        if not level:
            return Response({'error': 'Level not found'}, status=status.HTTP_404_NOT_FOUND)

        # Mengambil skor yang dikirimkan dari request body, jika null akan diisikan nilai 0
        score_to_add = request.data.get('score', 0)

        # Memperbarui score pada profile
        try:
            score_to_add = int(score_to_add)
            profile.score += score_to_add
            profile.save()
        except ValueError:
            return Response({'error': 'Invalid score value'}, status=status.HTTP_400_BAD_REQUEST)

        # Memeriksa apakah level sudah diselesaikan
        if level not in profile.completed_levels.all():
            profile.completed_levels.add(level)
            profile.save()
            return Response({'message': 'Level completed successfully'}, status=status.HTTP_200_OK)
        
        return Response({'message': 'Level already completed'}, status=status.HTTP_200_OK)
