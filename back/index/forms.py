from django import forms
from django.contrib.auth.models import User

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={"class":"myfield"}))
    password2 = forms.CharField(label='Repeat password', widget=forms.PasswordInput(attrs={"class":"myfield"}))

    class Meta:
        model = User
        fields = ('username', 'email')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['email'].widget.attrs.update({
            'class': 'myfield',
            'placeholder': 'Enter your email',
        })
        self.fields['email'].widget.attrs.update({
            'class': 'myfield',
            'placeholder': 'Enter your email',
            'required': False,
        })
        self.fields['email'].widget.attrs['class'] = 'myfield'
        self.fields['submit'] = forms.CharField(widget=forms.TextInput(attrs={
            'class': 'my-submit-class',
            'value': 'Submit'
        }))

    def clean_password2(self):
        cd = self.cleaned_data
        if cd['password'] != cd['password2']:
            raise forms.ValidationError('Passwords don\'t match.')
        return cd['password2']