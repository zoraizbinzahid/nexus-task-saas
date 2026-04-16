from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Workspace
from .serializers import WorkspaceSerializer

# Create your views here.
class WorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This ensures users only see workspaces they are members of!
        return Workspace.objects.filter(members__user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the owner to the user who is logged in
        serializer.save(owner=self.request.user)