from django.contrib import admin
from .models import Workspace, WorkspaceMember

# Register your models here.
class WorkspaceMemberInLine(admin.TabularInline):
    model = WorkspaceMember
    extra = 1

@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'slug', 'created_at')
    inlines = [WorkspaceMemberInLine]

admin.site.register(WorkspaceMember)