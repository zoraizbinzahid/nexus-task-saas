from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Workspace(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='owned_workspaces'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class WorkspaceMember(models.Model):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('MEMBER', 'Member'),
    ]
    workspace = models.ForeignKey(
        Workspace, 
        on_delete=models.CASCADE, 
        related_name="members"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='MEMBER')

    class Meta:
        unique_together = ('workspace', 'user') 

    def __str__(self):
        return f"{self.user.email} - {self.workspace.name} ({self.role})"