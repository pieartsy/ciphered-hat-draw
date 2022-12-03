from django import forms
from .models import Hat
from django.forms import ModelForm

class HatForm(ModelForm):
    template_name = "hatform.html"
    class Meta:
        model = Hat
        fields = ['hat_names_text', 'hat_tasks_text', 'task_discard']
        exclude = ['unique_id']