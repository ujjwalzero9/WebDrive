from django.urls import path
from . import views
from .views import create_user,create_entity, get_folder_contents,get_entities_in_home,get_entities,GetPresignedURLView,login_view,rename_entity,entity_details
urlpatterns = [
    path('create_user/', create_user, name='create_user_api'),
    path('create_entity/',create_entity, name='create_entity'),
    path('get_folder_contents/', get_folder_contents, name='get_folder_contents'),
    path('delete_entity/', views.delete_entity, name='delete_entity'), 
    path('move_entity/<int:entity_id>/', views.move_entity, name='move_entity'),
    path('get_entities_in_home/', get_entities_in_home, name='get_entities_in_home'),
    path('get_entities/', get_entities, name='get_entities'),
    path('get_presigned_url/',  GetPresignedURLView.as_view(), name='get_presigned_url'),
    path('login/', login_view, name='login_view'),
    path('validate-credentials/', views.validate_credentials, name='validate-credentials'),
    path('rename_entity/', views.rename_entity, name='rename_entity'),
    path('entity_details/', views.entity_details, name='entity_details'),
]
