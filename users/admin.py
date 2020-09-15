from django.contrib import admin
from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import CustomUser, Profile
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserCreationForm(forms.ModelForm):
	password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
	password2 = forms.CharField(label="Password confirmation", widget=forms.PasswordInput)
	
	class Meta:
		model = CustomUser
		fields = ('email', 'username')

	def clean_password2(self):
		password1 = self.cleaned_data.get("password1")
		password2 = self.cleaned_data.get("password2")
		if password1 and password2 and password1 != password2:
			raise forms.ValidationError("Passwords don't match")
		return password2

	def save(self, commit=True):
		user = super(UserCreationForm, self).save(commit=False)
		user.set_password(self.cleaned_data["password1"])
		if commit:
			user.save()
		return user


class UserChangeForm(forms.ModelForm):
	password = ReadOnlyPasswordHashField()

	class Meta:
		model = CustomUser
		fields = ('email', 'username', 'password', 'is_active', 'is_staff', 'is_superuser')

	def clean_password(self):
		return self.initial["password"]


class CustomUserAdmin(BaseUserAdmin):
	form = UserChangeForm
	add_form = UserCreationForm

	model = CustomUser
	list_display = ('email', 'username', 'is_staff', 'is_active') 
	list_filter = ('is_staff',) 
	search_fields = ('email', 'username')  
	ordering = ('username',)  
	filter_horizontal = () 
	fieldsets = (
		(None, {'fields': ('email', 'password')}),
		('Personal info', {'fields': ('username',)}),
		('Permissions', {'fields': ('is_staff', 'is_superuser')}),
	)
	add_fieldsets = (
		(None, {
			'classes': ('wide',),
			'fields': ('email', 'username', 'password1', 'password2')}
		),
	)
    


# Register your models here.
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Profile)

