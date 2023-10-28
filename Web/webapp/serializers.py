from rest_framework import serializers
from .models import User, UserCredentials
from rest_framework import serializers
from .models import Entity

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']  # Add other fields as needed

class UserCredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCredentials
        fields = ['id', 'keytoken', 'password']  # Include the 'password' field


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity
        fields = [
            'id',
            'folder_path',
            'name',
            'content_type',
            'hashpath',
            'is_folder',
            'parent_folder',
            'user_id',
            'url',
        ]
