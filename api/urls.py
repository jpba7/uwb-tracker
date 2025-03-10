from django.urls import include, path
from .views import CreateUserView, CurrentUserView

urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('user/current/', CurrentUserView.as_view(), name='current_user'),
    path('api-auth/', include('rest_framework.urls')),
]
