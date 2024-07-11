# authentication/urls.py
from django.urls import path
from . import views

urlpatterns = [

    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('signup2/', views.signup2, name='signup2'),
    path('get_user_profile/', views.get_user_profile, name='get_user_profile'),
    path('save_profile/', views.save_profile, name='save_profile'),
    path('pop_sql/',views.pop_sql,name='pop_sql'), 
    path('get_head/',views.get_head, name='get_head'),
]
