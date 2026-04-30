from rest_framework import serializers
from .models import Workspace, WorkspaceMember
from accounts.models import User

class WorkspaceSerializer(serializers.ModelSerializer):
    # This tells the API to show the owner's email instead of just their ID number
    owner_email = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Workspace
        fields = ['id', 'name', 'slug', 'owner', 'owner_email', 'created_at']
        read_only_fields = ['owner', 'slug']


class WorkspaceMemberSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source="user.email")
    user_username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = WorkspaceMember
        fields = ["id", "workspace", "user", "user_email", "user_username", "role"]
        read_only_fields = ["workspace", "user_email", "user_username"]


class WorkspaceMemberCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=WorkspaceMember.ROLE_CHOICES, default="MEMBER")

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user exists with this email.")
        return value