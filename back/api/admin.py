from django.contrib import admin
from django.apps import apps
from api.models import *


# Register your models here.

class DefaultModelAdmin(admin.ModelAdmin):
    pass


class AllFieldsModelAdmin(admin.ModelAdmin):
    def __init__(self, model, admin_site):
        super().__init__(model, admin_site)
        self.list_display = [field.name for field in model._meta.fields]


app = apps.get_app_config("api")
for model in app.get_models():
    if not admin.site.is_registered(model):
        admin.site.register(model, AllFieldsModelAdmin)
