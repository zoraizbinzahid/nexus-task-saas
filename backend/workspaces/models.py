from django.db import models
from django.conf import settings

# Create your models here.

class Workspace(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    owner = models.ForeignKey(
        settings.Auth_USER_MODEL,on_delete=models.CASCADE,related_nane='owned_workspaces'

)
created_at = models.DateTimeField(auto_now_add=true)

def __str__(self):
    return self.name


class WorkspaceMember(models.Model):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('MEMBER', 'Member'),
    ]
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='MEMBER')

    class Meta:
        unique_together = ('workspace', 'user') # A user can't join the same workspace twice!