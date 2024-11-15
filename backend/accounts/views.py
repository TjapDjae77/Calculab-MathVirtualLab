from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, ProfileSerializer
from django.contrib.auth.models import User
from .models import Profile
import logging
logger = logging.getLogger(__name__)

class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(
                    {"status": "success", "message": "User registered successfully"},
                    status=status.HTTP_201_CREATED
                )
        except Exception as e:
            errors = {}
            for field, messages in serializer.errors.items():
                errors[field] = [str(message) for message in messages]
                
            return Response(
                {"status": "error", "errors": errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class ProfileView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     logger.debug("ProfileView GET request initiated.")
    #     try:
    #         profile = request.user.profile
    #         serializer = ProfileSerializer(profile)
    #         logger.debug(f"Profile data for user {request.user.username} retrieved successfully.")
    #         return Response(serializer.data)
    #     except Profile.DoesNotExist:
    #         logger.error("Profile not found for the authenticated user.")
    #         return Response({"error": "Profile not found"}, status=404)
    def get_object(self):
        profile = self.request.user.profile
        logger.debug(f"Fetching profile for user: {profile.user.username}")
        return profile
    
    def get(self, request, *args, **kwargs):
        print("GET request received")
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
@api_view(['POST'])
def update_score(request):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user=request.user)
        new_score = request.data.get('score', 0)

        try:
            new_score = int(new_score)
            profile.score += new_score
            profile.save()
            return Response({
                'status': 'success',
                'message': 'Score updated successfully',
                'current_score': profile.score
            }, status=status.HTTP_200_OK)
        except ValueError:
            return Response({
                'status': 'error',
                'message': 'Invalid score value'
            }, status=status.HTTP_400_BAD_REQUEST)
    return Response({
        'status': 'error',
        'message': 'Authentication required'
    }, status=status.HTTP_401_UNAUTHORIZED)
