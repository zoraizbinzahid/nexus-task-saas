from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from workspaces.views import WorkspaceViewSet

# 1. Create the router
router = DefaultRouter()

# 2. Register the Workspace ViewSet
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')

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
]