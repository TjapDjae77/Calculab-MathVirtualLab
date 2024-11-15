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
                pass
        
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
            raise serializers.ValidationError({"status": "error", "message": "Incorrect username or password"})

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            return Response({
                'status': 'error',
                'message': 'Incorrect username or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
@csrf_exempt
def log_frontend(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            log_level = data.get('level', 'info').lower()
            message = data.get('message', '')

            if log_level == 'debug':
                logger.debug(message)
            elif log_level == 'warning':
                logger.warning(message)
            elif log_level == 'error':
                logger.error(message)
            else:
                logger.info(message)
                logger.info(f"Response data: {data}")

            return JsonResponse({'status': 'success'})
        except Exception as e:
            logger.error(f"Failed to log frontend message: {e}")
            return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)