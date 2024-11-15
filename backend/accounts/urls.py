from django.urls import path
from .views import RegisterView, ProfileView, update_score

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register_user'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('update_score/', update_score, name='update_score')
]