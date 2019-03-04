from django.shortcuts import render, HttpResponse, redirect, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.core import serializers
from . models import Feed
import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.


def index(request):
	template='posts/index.html'
	results=Feed.objects.all()
	context={
		'results':results,
	}
	return render(request, template, context)

def getdata(request):
	results=Feed.objects.all()
	jsondata = serializers.serialize('json',results)
	return HttpResponse(jsondata)

def base_layout(request):
	template='posts/base.html'
	return render(request, template)


def logins(request):
	template='posts/login.html'
	return render(request, template)

def register(request):
	template='posts/register.html'
	return render(request, template)

def all_user(request):
	users=User.objects.all()
	jsondata = serializers.serialize('json',users)
	return HttpResponse(jsondata)

class Register(APIView):
	print('working api')
	def post(self, request):
		data = request.data
		print(request.data)
		print('working api')
		for data in data:
			print(data['username'])
			try:
				User.objects.create_user(username=data['username'],
	                                 	email=data['email'],
	                                 	password=data['password'])
			except:
				pass
		return HttpResponse(data)


class Signin(APIView):
	print('working api')
	def post(self, request):
		data = request.data
		print(data['username'])
		print(data['password'])
		username = data['username']
		password = data['password']
		user = authenticate(username=username, password=password)
		if user is not None:
			login(request, user)
		return Response(data)

def logouts(request):
	logout(request)
	return redirect('login')


