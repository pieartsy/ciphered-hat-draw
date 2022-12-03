from django.db import models

# Create your models here.
class Hat(models.Model):
    unique_id = models.CharField(max_length=100)
    hat_names_text = models.TextField()
    hat_tasks_text = models.TextField()
    task_discard = models.BooleanField(blank=True)
    def __str__(self):
        return self.unique_id

class HatName(models.Model):
    hat_name = models.ForeignKey(Hat, on_delete=models.CASCADE)
    hat_name_text = models.CharField(max_length=100)
    def __str__(self):
        return self.hat_name_text

class HatTask(models.Model):
    hat_task = models.ForeignKey(Hat, on_delete=models.CASCADE)
    hat_task_text = models.CharField(max_length=400)
    def __str__(self):
        return self.hat_task_text