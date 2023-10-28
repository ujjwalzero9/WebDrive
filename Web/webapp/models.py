from django.db import models
from hashlib import sha256

class User(models.Model):
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    email = models.EmailField()

    def __str__(self):
        return self.name

class UserCredentials(models.Model):
    reference_id = models.OneToOneField(User, on_delete=models.CASCADE)
    password = models.CharField(max_length=255)
    keytoken = models.CharField(max_length=64)

    def generate_keytoken(self):
        data = f"{self.reference_id.name}{self.reference_id.id}"  # Use .id instead of .user_id
        self.keytoken = sha256(data.encode()).hexdigest()

    def save(self, *args, **kwargs):
        if not self.keytoken:
            self.generate_keytoken()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Credentials for {self.reference_id.name}"

class Entity(models.Model):
    folder_path = models.TextField()
    name = models.CharField(max_length=255)
    content_type = models.CharField(max_length=255)
    hashpath = models.CharField(max_length=255)
    is_folder = models.BooleanField()
    parent_folder = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    user_id = models.IntegerField(default=0)
    url = models.URLField(max_length=200)

    def __str__(self):
        return self.name
