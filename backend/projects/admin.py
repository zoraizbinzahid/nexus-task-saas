from django.contrib import admin
from .models import Project

# Register your models here.
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'workspace', 'created_at')
    list_filter = ('workspace',) # This adds a filter sidebar on the right!
    search_fields = ('name',)

