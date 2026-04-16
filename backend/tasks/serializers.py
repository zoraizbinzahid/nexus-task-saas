from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    assignee_email = serializers.ReadOnlyField(source='assignee.email')

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'title', 'description', 
            'status', 'priority', 'deadline', 
            'assignee', 'assignee_email', 'created_at'
        ]