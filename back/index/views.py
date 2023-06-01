import re

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.forms import forms
from django.shortcuts import render,redirect
from django.urls import reverse_lazy

# Create your views here.

from django.views.generic import TemplateView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.views.generic import View

class IndexView(TemplateView):
    template_name = 'index/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Конструктор чат бота'
        return context

class RegistrationView(TemplateView):
    template_name = 'index/signup.html'
    form_class = UserCreationForm
    success_url = reverse_lazy('home')

    def get(self, request, *args, **kwargs):
        context = {'page_title': request.path[1:-1].capitalize()}
        # Здесь вы можете добавить свою логику для обработки GET-запроса и передачи контекста в шаблон
        return render(request, self.template_name, context)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect(self.success_url)


from .forms import UserRegistrationForm

def register(request):
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)
        if user_form.is_valid():
            # Create a new user object but avoid saving it yet
            new_user = user_form.save(commit=False)
            # Set the chosen password
            new_user.set_password(user_form.cleaned_data['password'])
            # Save the User object
            new_user.save()
            return render(request, 'index/register1_done.html', {'new_user': new_user})
    else:
        user_form = UserRegistrationForm()
    return render(request, 'index/signup.html', {'user_form': user_form})

class LoginView(View):
    def get(self, request):
        context = {'page_title': request.path[1:-1].capitalize()}
        return render(request, 'index/signin.html', context)

    def post(self, request):
        context = {'page_title': request.path[1:-1].capitalize()}
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')

        return render(request, 'index/signin.html', {'error': 'Invalid username or password'}, context)

class HomeView(TemplateView):
    template_name = 'index/home.html'



@login_required
def dashboard(request):
    return render(request, 'index/dashboard.html', {'section': 'dashboard'})

