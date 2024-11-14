from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
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
