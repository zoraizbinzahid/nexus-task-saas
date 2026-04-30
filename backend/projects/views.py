from rest_framework import viewsets, permissions
from django.db.models import Q
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(
            Q(workspace__owner=self.request.user) | Q(workspace__members__user=self.request.user)
        ).distinct()