from django.shortcuts import render
from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Workspace, WorkspaceMember
from .serializers import WorkspaceSerializer, WorkspaceMemberSerializer, WorkspaceMemberCreateSerializer
from accounts.models import User

# Create your views here.
class WorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Workspace.objects.filter(
            Q(owner=self.request.user) | Q(members__user=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        # Automatically set the owner to the user who is logged in
        workspace = serializer.save(owner=self.request.user)
        WorkspaceMember.objects.get_or_create(
            workspace=workspace,
            user=self.request.user,
            defaults={"role": "ADMIN"},
        )

    def _is_workspace_admin(self, workspace):
        if workspace.owner_id == self.request.user.id:
            return True
        return WorkspaceMember.objects.filter(
            workspace=workspace,
            user=self.request.user,
            role="ADMIN"
        ).exists()

    @action(detail=True, methods=["get"], url_path="members")
    def members(self, request, pk=None):
        workspace = self.get_object()
        members = WorkspaceMember.objects.filter(workspace=workspace).select_related("user")
        serializer = WorkspaceMemberSerializer(members, many=True)
        return Response(serializer.data)

    @members.mapping.post
    def add_member(self, request, pk=None):
        workspace = self.get_object()
        if not self._is_workspace_admin(workspace):
            return Response(
                {"detail": "Only workspace admins can add members."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = WorkspaceMemberCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data["email"])
        role = serializer.validated_data["role"]

        member, created = WorkspaceMember.objects.get_or_create(
            workspace=workspace,
            user=user,
            defaults={"role": role},
        )
        if not created:
            member.role = role
            member.save(update_fields=["role"])

        return Response(
            WorkspaceMemberSerializer(member).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )