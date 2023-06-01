from django.contrib import admin

from django.urls import path, include

from index import views
from index.views import *
from django.contrib.auth.views import *



urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('signup/', views.register, name='signup'),
    path('signin/', LoginView.as_view(), name='login'),
    path('home/', HomeView.as_view(), name='home'),
path('accounts/', include('django.contrib.auth.urls')),

]
