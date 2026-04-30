from rest_framework import serializers
from .models import Task
from projects.models import Project

class TaskSerializer(serializers.ModelSerializer):
    assignee_email = serializers.ReadOnlyField(source='assignee.email')
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), required=True)

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'title', 'description', 
            'status', 'priority', 'deadline', 
            'assignee', 'assignee_email', 'created_at'
        ]

    def validate_project(self, value):
        request = self.context.get('request')
        if request and not (
            value.workspace.owner_id == request.user.id
            or value.workspace.members.filter(user=request.user).exists()
        ):
            raise serializers.ValidationError("You do not have access to this project.")
        return value

    def validate(self, attrs):
        project = attrs.get("project")
        assignee = attrs.get("assignee")
        if project and assignee:
            if not project.workspace.members.filter(user=assignee).exists():
                raise serializers.ValidationError({"assignee": "Assignee must be a member of this workspace."})
        return attrs