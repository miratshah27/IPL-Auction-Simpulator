from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from .views import index
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('iplbackendapi.urls')),
    # path('app/leaderboard/',index,name='index'),
    re_path(r'^app/',index,name='index'),
] + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
