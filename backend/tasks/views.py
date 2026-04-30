from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(
            Q(project__workspace__owner=self.request.user) | Q(project__workspace__members__user=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        project = serializer.validated_data.get("project")
        if project is None:
            raise ValidationError({"project": "A valid project ID is required."})
        serializer.save()