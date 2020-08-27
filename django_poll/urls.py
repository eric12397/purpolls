"""django_poll URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static 
from django.views.generic import TemplateView

# checks URL if they include the following strings
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('polls.urls')), # sends 'localhost:8000' to polls/urls.py 
    path('', include('comments.urls')),
    path('', include('users.urls')),
    path('', TemplateView.as_view(template_name="index.html"))
]

urlpatterns += [
    re_path('^.*$', TemplateView.as_view(template_name="index.html"))
]

if settings.DEBUG:
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
