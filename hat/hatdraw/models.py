from django.db import models

# Create your models here.
class Hat(models.Model):
    URL = models.CharField(max_length=20)
    def __str__(self):
        return self.hatName

class Person(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.person

class Task(models.Model):
    description = models.CharField(max_length=400)
    def __str__(self):
        return self.task

class Assignment(models.Model):
    hat = models.ForeignKey(Hat, on_delete=models.CASCADE)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.person.name} in {self.hat.name} has task {self.task.description}"