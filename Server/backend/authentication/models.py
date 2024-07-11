# models.py
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    username = models.OneToOneField(User, on_delete=models.CASCADE, to_field='username', db_column='username', primary_key=True)
    first_name = models.CharField(max_length=50,blank=True, null=True)
    last_name = models.CharField(max_length=50,blank=True, null=True)
    email = models.EmailField(max_length=100,)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.username.username