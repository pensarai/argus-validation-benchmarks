from django.urls import path
from .views import ImageUploadView, ImagePreviewView

urlpatterns = [
    path("upload/", ImageUploadView.as_view(), name="image-upload"),
    path("preview/", ImagePreviewView.as_view(), name="image-preview"),
]
