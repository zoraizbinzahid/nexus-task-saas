from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)

    # Add these two specific lines to fix the "clash"
    groups = models.ManyToManyField(Group, related_name="nexus_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="nexus_user_permissions", blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email