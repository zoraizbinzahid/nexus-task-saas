from rest_framework import serializers
from .models import Workspace, WorkspaceMember

class WorkspaceSerializer(serializers.ModelSerializer):
    # This tells the API to show the owner's email instead of just their ID number
    owner_email = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Workspace
        fields = ['id', 'name', 'slug', 'owner', 'owner_email', 'created_at']
        read_only_fields = ['owner', 'slug']