from django.urls import path
from .views import SoalListView, SoalDetailView

urlpatterns = [
    path('', SoalListView.as_view(), name='list_soal'),
    path('<int:pk>/', SoalDetailView.as_view(), name='detail_soal'),  # Detail soal
]