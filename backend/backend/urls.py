from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from workspaces.views import WorkspaceViewSet
from projects.views import ProjectViewSet
from tasks.views import TaskViewSet
from accounts.views import DeleteAccountView

# 1. Create the router
router = DefaultRouter()

# 2. Register the Workspace ViewSet
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # This line connects all the Google login/signup magic
    path('accounts/', include('allauth.urls')),

    # 3. This line connects your new Workspace API!
    path('api/', include(router.urls)),
    
    # These lines are for your regular Login/Logout API
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/social/', include('allauth.socialaccount.urls')),
    path('api/auth/account/delete/', DeleteAccountView.as_view(), name='account-delete'),
]