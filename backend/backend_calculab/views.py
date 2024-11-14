from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status, serializers
import json
import logging

logger = logging.getLogger(__name__)

def home(request):
    return render(request, 'landing_page.html')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get('username')
        password = attrs.get('password')        

        user = authenticate(request=self.context.get('request'), username=username_or_email, password=password)

        if user is None:
            # Coba autentikasi sebagai email jika autentikasi username gagal
            try:
                from django.contrib.auth.models import User
                user_obj = User.objects.get(email=username_or_email)
                username = user_obj.username
                user = authenticate(request=self.context.get('request'), username=username, password=password)
            except User.DoesNotExist:
                raise serializers.ValidationError({"status": "error", "message": "Invalid credentials"})
        
        if user is not None:
            # Jika autentikasi berhasil, tetapkan user pada serializer
            self.user = user
            attrs["username"] = user.username
            data = super().validate(attrs)
            data['status'] = 'success'
            data['message'] = 'Login successful'
            data['data'] = {
                'username': user.username,
                'token': data.pop('access')
            }
            return data
        else:
            # Jika autentikasi gagal, kembalikan pesan error
            raise serializers.ValidationError({"status": "error", "message": "Invalid credentials"})

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer