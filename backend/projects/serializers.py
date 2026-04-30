from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'workspace', 'name', 'description', 'created_at']

    def validate_workspace(self, value):
        request = self.context.get("request")
        if request and not (value.owner_id == request.user.id or value.members.filter(user=request.user).exists()):
            raise serializers.ValidationError("You do not have access to this workspace.")
        return value