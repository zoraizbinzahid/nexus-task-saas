from django.db import models
from workspaces.models import Workspace

class Project(models.Model):
    name = models.CharField(max_length=255) # Fixed 'l'
    description = models.TextField(blank=True, null=True)
    workspace = models.ForeignKey(
        Workspace, 
        on_delete=models.CASCADE, 
        related_name="projects" # Double check spelling here
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.workspace.name} | {self.name}"