from django.contrib import admin
from .models import User, UserCredentials, Entity

# Register your models here.
admin.site.register(User)
admin.site.register(UserCredentials)
admin.site.register(Entity)
