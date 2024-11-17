from django.urls import path
from .views import LevelListView, LevelDetailView, CompleteLevelView

urlpatterns = [
    path('', LevelListView.as_view(), name='level_list'),  # URL untuk daftar level
    path('<int:pk>/', LevelDetailView.as_view(), name='level_detail'), # URL untuk detail level
    path('complete/<int:pk>/', CompleteLevelView.as_view(), name='complete_level'),
]