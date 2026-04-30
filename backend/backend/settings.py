import os
import dj_database_url
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Detect if we are on Localhost or Production
IS_PRODUCTION = os.getenv('RAILWAY_ENVIRONMENT') is not None or not DEBUG

# --- SECURITY ---
ALLOWED_HOSTS = ['*'] # Railway/Vercel handle this, but you can restrict later

# --- APPS ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    # 3rd Party
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'corsheaders',
    'dj_rest_auth',
    'dj_rest_auth.registration',

    # Allauth
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    # Local Apps
    'accounts',
    'workspaces',
    'projects',
    'tasks',
]

SITE_ID = 1

# --- MIDDLEWARE ---
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'backend.urls'

# --- CORS & CSRF ---
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Dynamically add production frontend URL if it exists in .env
PROD_FRONTEND_URL = os.getenv('FRONTEND_URL')
if PROD_FRONTEND_URL:
    CORS_ALLOWED_ORIGINS.append(PROD_FRONTEND_URL)

CORS_ALLOW_CREDENTIALS = True

# Required for cross-domain CSRF (Vercel -> Railway)
CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]
if os.getenv('BACKEND_URL'):
    CSRF_TRUSTED_ORIGINS.append(os.getenv('BACKEND_URL'))

# --- AUTH CONFIG ---
AUTH_USER_MODEL = 'accounts.User'
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# --- SAAS ACCOUNT LOGIC ---
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = True 
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
ACCOUNT_EMAIL_VERIFICATION = 'none' 
ACCOUNT_CONFIRM_EMAIL_ON_GET = True

# --- REST & JWT CONFIG (AUTO-ADAPTING) ---
REST_USE_JWT = True
JWT_AUTH_COOKIE = 'nexus-auth'
JWT_AUTH_REFRESH_COOKIE = 'nexus-refresh-token'

REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'nexus-auth',
    'JWT_AUTH_REFRESH_COOKIE': 'nexus-refresh-token',
    'JWT_AUTH_HTTPONLY': False,  # Changed to False so frontend can clear it on logout easily
    'JWT_AUTH_SECURE': IS_PRODUCTION,    # True in Production (HTTPS), False in Local (HTTP)
    'JWT_AUTH_SAMESITE': 'None' if IS_PRODUCTION else 'Lax', # None for Cross-Domain, Lax for Local
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# --- DATABASE (NEON/LOCAL) ---
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        # Only require SSL if we are NOT on localhost
        ssl_require=IS_PRODUCTION 
    )
}

# --- MAIL SETTINGS ---
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# --- REMAINING STANDARD SETTINGS ---
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
            'secret': os.getenv('GOOGLE_CLIENT_SECRET'),
            'key': ''
        },
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'}
    }
}