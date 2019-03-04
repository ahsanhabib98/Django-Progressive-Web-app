from django.urls import path
from rest_framework import routers
from . import views


urlpatterns = [
    path(r'', views.index,name='index'),
    path(r'base_layout',views.base_layout,name='base_layout'),
    path(r'getdata',views.getdata,name='getdata'),
    path(r'login',views.logins,name='login'),
    path(r'register',views.register,name='register'),
    path(r'signup',views.Register.as_view(),name='signup'),
    path(r'users',views.all_user,name='all_user'),
    path(r'signin',views.Signin.as_view(),name='signin'),
    path(r'logout',views.logouts,name='logout')
]