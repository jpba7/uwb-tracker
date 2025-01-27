from django.urls import include, path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from api.views import CreateUserView

urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('api-auth/', include('rest_framework.urls')),
]
