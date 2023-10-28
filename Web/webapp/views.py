from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import User, UserCredentials, Entity
from .serializers import UserSerializer, UserCredentialsSerializer, EntitySerializer
from django.shortcuts import get_object_or_404
from rest_framework import generics
import boto3
from django.conf import settings
import hashlib
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Entity  # Import your Entity model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def generate_hashpath(folder_path, user_id):
    data = f"{folder_path}{user_id}"
    hash_value = hashlib.sha256(data.encode()).hexdigest()
    return hash_value





from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
from .models import User
import json

from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from django.contrib.auth import authenticate
from django.http import JsonResponse
import json

from django.http import JsonResponse
from .models import User
import json

@api_view(['POST'])
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            # Try to find a user with the provided email
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({"message": "User not found"}, status=404)

            # Check if the provided password matches the user's password
            if password == user.password:
                # Authentication successful
                # You can perform additional actions after successful login if needed

                # Retrieve the existing UserCredentials record if it exists
                try:
                    user_credentials = UserCredentials.objects.get(reference_id=user)
                except UserCredentials.DoesNotExist:
                    user_credentials = None

                # Return the userid and keytoken in the response
                response_data = {
                    "message": "Login successful",
                    "userid": user.id,
                    "keytoken": user_credentials.keytoken if user_credentials else None
                }
                return JsonResponse(response_data)
            else:
                return JsonResponse({"message": "Invalid credentials"}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format in the request body"}, status=400)

    # Handle other HTTP methods or errors here
    return JsonResponse({"message": "Method not allowed"}, status=405)


@api_view(['POST'])
def create_user(request):
    if request.method == 'POST':
        # Get data from the request, e.g., request.data
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        # Create a User instance
        user = User.objects.create(
            name=username,
            password=password,  # You may want to hash the password properly
            email=email
        )

        # Create UserCredentials instance (keytoken will be generated automatically)
        user_credentials = UserCredentials.objects.create(
            reference_id=user,
            password=password,  # You may want to hash the password properly
        )

        # Generate hashpath for the home folder using folderPath
        home_folder_path = "/"
        hashpath = generate_hashpath(home_folder_path, user.id)

        # Create Entity instance as the home folder
        home_folder = Entity.objects.create(
            folder_path=home_folder_path,
            name=f"{username}'s Home",
            content_type="Folder",
            hashpath=hashpath,  # Assign the generated hashpath
            is_folder=True,
            parent_folder=None,  # Parent folder is null
            user_id=user.id,  # Assign the user ID to the home folder
            url="",  # You can set this as needed
        )

        # Return the userid and keytoken in the response
        return JsonResponse({
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "keytoken": user_credentials.keytoken,
        }, status=status.HTTP_201_CREATED)

    # Handle other HTTP methods or errors here
    return JsonResponse({"message": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def create_entity(request):
    try:
        data = request.data

        # Calculate the hashpath using the new generate_hashpath function
        user_id = data['user_id']
        folder_path = data.get('folder_path', '/')  # Provide a default path if not specified
        parent_id = data.get('parent_id')  # Get the parent entity ID (if creating inside another entity)
        hashpath = generate_hashpath(folder_path,user_id)

        # Create a new Entity instance based on the 'is_folder' flag
        if data.get('is_folder', True):
            # Create a folder
            new_entity = Entity(
                folder_path = f"{folder_path}/{data['name']}",
                name=data['name'],  # Changed 'content_name' to 'name'
                content_type='Folder',
                hashpath=hashpath,  # Set hashpath for folders
                is_folder=True,
                user_id=user_id,
                parent_folder_id=parent_id  # Assign the parent entity ID
            )
        else:
            # Create a file
            new_entity = Entity(
                folder_path = f"{folder_path}/{data['name']}",
                name=data['name'],  # Changed 'content_name' to 'name'
                content_type=data.get('content_type', ''),
                hashpath=hashpath,  # Set hashpath for files
                is_folder=False,
                user_id=user_id,
                url=data['url'],
                parent_folder_id=parent_id  # Assign the parent entity ID
            )

        new_entity.save()

        response_data = {
            "message": "Entity created successfully",
            "entity_id": new_entity.id
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_folder_contents(request):
    try:
        # Get user_id and folder_path from the request query parameters
        user_id = request.query_params.get('user_id')
        folder_path = request.query_params.get('folder_path', '/')  # Default to root folder if not specified

        # Calculate the hashpath based on user_id and folder_path
        hashpath = generate_hashpath(folder_path,user_id)

        # Retrieve all entities with the same hashpath
        folder_contents = Entity.objects.filter(user_id=user_id, hashpath=hashpath)

        # Serialize the folder contents
        serialized_contents = []
        for entity in folder_contents:
            serialized_contents.append({
                "entity_id": entity.id,
                "name": entity.name,
                "content_type": entity.content_type,
                "hashpath": entity.hashpath,
                "is_folder": entity.is_folder,
                "user_id": entity.user_id,
                "url": entity.url,
                "folder_path": entity.folder_path,  # Include folder_path in the response
            })

        return Response(serialized_contents, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Entity  # Import your Entity model

@api_view(['GET'])
def get_entities_in_home(request, user_id, hashpath):
    if request.method == 'GET':
        try:
            # Get the home folder for the user
            home_folder = Entity.objects.get(user_id=user_id, hashpath=hashpath)

            # Get all entities whose parent is the home folder
            entities = Entity.objects.filter(parent_folder=home_folder)

            # Serialize the entities and return the data
            serialized_entities = []  # You should define a serializer for Entity
            for entity in entities:
                serialized_entities.append({
                    "id": entity.id,
                    "name": entity.name,
                    "content_type": entity.content_type,
                    # Add other fields you want to include
                })

            return Response(serialized_entities, status=status.HTTP_200_OK)

        except Entity.DoesNotExist:
            return Response({"error": "Home folder not found"}, status=status.HTTP_404_NOT_FOUND)

    # Handle other HTTP methods or errors here
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)




@api_view(['POST'])
def get_entities_in_home(request):
    if request.method == 'POST':
        try:
            # Get the user ID from the JSON request data
            user_id = request.data.get('user_id')

            # The folder path is always "/"
            folder_path = "/"

            # Generate the hashpath using your existing function
            hashpath = generate_hashpath(folder_path, user_id)

            # Get all entities with the same hashpath
            entities = Entity.objects.filter(hashpath=hashpath)

            # Serialize the entities and return the data
            serialized_entities = []  # You should define a serializer for Entity
            for entity in entities:
                serialized_entities.append({
                    "id": entity.id,
                    "name": entity.name,
                    "content_type": entity.content_type,
                    # Add other fields you want to include
                })

            return Response(serialized_entities, status=status.HTTP_200_OK)

        except Entity.DoesNotExist:
            return Response({"error": "Entities not found for the specified user ID"}, status=status.HTTP_404_NOT_FOUND)

    # Handle other HTTP methods or errors here
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
@api_view(['POST'])
def get_entities(request):
    if request.method == 'POST':
        try:
            # Get the user ID from the JSON request data
            user_id = request.data.get('user_id')

            # The folder path is always "/"
            folder_path = request.data.get('folder_path')

            # Generate the hashpath using your existing function
            hashpath = generate_hashpath(folder_path, user_id)

            # Get all entities with the same hashpath
            entities = Entity.objects.filter(hashpath=hashpath)

            # Serialize the entities and return the data
            serialized_entities = []  # You should define a serializer for Entity
            for entity in entities:
                serialized_entities.append({
                    "id": entity.id,
                    "name": entity.name,
                    "content_type": entity.content_type,
                    # Add other fields you want to include
                })

            return Response(serialized_entities, status=status.HTTP_200_OK)

        except Entity.DoesNotExist:
            return Response({"error": "Entities not found for the specified user ID"}, status=status.HTTP_404_NOT_FOUND)

    # Handle other HTTP methods or errors here
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

class GetPresignedURLView(generics.CreateAPIView):
    def create(self, request, *args, **kwargs):
        filename = request.data.get('filename')

        # Generate a pre-signed URL for the S3 bucket
        s3_client = boto3.client('s3', aws_access_key_id='AKIAWBUEWYQO5KGVHBVY',aws_secret_access_key='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')
        post = s3_client.generate_presigned_post(Bucket='backendc', Key=filename, ExpiresIn=3600)

        return Response({'post': post}, status=status.HTTP_200_OK)
# views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Entity
from django.shortcuts import get_object_or_404
import hashlib

@api_view(['DELETE'])
def delete_entity(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode('utf-8'))
            entity_id = data.get('entity_id', None)

            if entity_id is not None:
                # Retrieve the Entity by Entity_id
                entity = Entity.objects.get(pk=entity_id)

                # Delete the Entity and its contents (sub-entities and files)
                delete_entity_recursive(entity)

                return Response({'message': 'Entity and its contents deleted successfully'})
            else:
                return Response({'error': 'entity_id not provided in JSON input'}, status=status.HTTP_400_BAD_REQUEST)
        except Entity.DoesNotExist:
            return Response({'error': 'Entity not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

def delete_entity_recursive(entity):
    # Delete the Entity's contents (sub-entities and files)
    sub_entities = Entity.objects.filter(parent_folder=entity)
    for sub_entity in sub_entities:
        delete_entity_recursive(sub_entity)

    # Delete the Entity itself
    entity.delete()

@api_view(['PUT'])
def rename_entity(request):
    try:
        data = request.data
        folder_id = data.get('folder_id')
        new_name = data.get('new_name')

        # Retrieve the Entity by folder_id
        entity = get_object_or_404(Entity, pk=folder_id)

        # Get the old folder path
        old_folder_path = entity.folder_path

        # Update the Entity name
        entity.name = new_name
        entity.save()

        # Calculate the path difference
        path_difference = f"{entity.folder_path}/{new_name[len(old_folder_path):]}"

        # Update sub-entities' paths recursively
        update_sub_entity_paths(entity, path_difference)

        return Response({'message': 'Entity renamed successfully'})
    except Entity.DoesNotExist:
        return Response({'error': 'Entity not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

def update_sub_entity_paths(parent_entity, path_difference):
    sub_entities = Entity.objects.filter(folder_path__startswith=parent_entity.folder_path)
    for sub_entity in sub_entities:
        sub_entity.folder_path = sub_entity.folder_path.replace(parent_entity.folder_path, path_difference, 1)
        sub_entity.save()


@api_view(['PUT'])
def move_entity(request, entity_id):
    try:
        # Parse JSON data from the request body
        data = request.data

        # Retrieve the Entity by Entity_id
        entity = get_object_or_404(Entity, pk=entity_id)

        # Get the new parent Entity ID from the request data
        new_parent_entity_id = data['new_parent_entity_id']

        # Calculate the new Entity path based on the new parent Entity
        new_parent_entity = Entity.objects.get(pk=new_parent_entity_id)
        new_entity_path = f"{new_parent_entity.folder_path}/{entity.name}"

        # Update the Entity's parent Entity and path
        entity.parent_folder = new_parent_entity
        entity.folder_path = new_entity_path
        entity.save()

        return Response({'message': 'Entity moved successfully'})
    except Entity.DoesNotExist:
        return Response({'error': 'Entity not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

def generate_hashpath(folder_path, user_id):
    data = f"{folder_path}{user_id}"
    hash_value = hashlib.sha256(data.encode()).hexdigest()
    return hash_value

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserCredentials

@csrf_exempt  # This decorator allows POST requests without CSRF protection (for demonstration purposes)
def validate_credentials(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            userid = data.get("userid")
            keytoken = data.get("keytoken")

            # Query the UserCredentials table to check if userid and keytoken match
            try:
                user_credentials = UserCredentials.objects.get(reference_id=userid, keytoken=keytoken)
                return JsonResponse({"message": "Credentials are valid"}, status=200)
            except UserCredentials.DoesNotExist:
                return JsonResponse({"message": "Invalid credentials"}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format in the request body"}, status=400)

    # Handle other HTTP methods or errors here
    return JsonResponse({"message": "Method not allowed"}, status=405)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Entity  # Import your Entity model
from .serializers import EntitySerializer  # Import your Entity serializer
 # Import your hashpath generation function

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Entity  # Import your Entity model
from .serializers import EntitySerializer  # Import your Entity serializer
  # Import your hashpath generation function

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Entity  # Import your Entity model
from .serializers import EntitySerializer  # Import your Entity serializer
 # Import your hashpath generation function

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Entity

@api_view(['POST'])
def entity_details(request):
    if request.method == 'POST':
        try:
            # Get the entity ID from the JSON request data
            entity_id = request.data.get('entity_id')

            # Retrieve the entity by its ID
            entity = Entity.objects.get(id=entity_id)

            # Check if the entity is a file
            if entity.is_folder == False:
                # If it's a file, return the URL
                return Response({"url": entity.url}, status=status.HTTP_200_OK)

        except Entity.DoesNotExist:
            return Response({"error": "Entity not found for the specified entity ID"}, status=status.HTTP_404_NOT_FOUND)
        except Entity.MultipleObjectsReturned:
            return Response({"error": "Multiple entities found for the specified entity ID"}, status=status.HTTP_400_BAD_REQUEST)

    # Handle other HTTP methods or errors here
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
