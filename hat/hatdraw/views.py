from django.shortcuts import render
from random import shuffle
from django.http import JsonResponse
from .models import Hat, Person, Task, Assignment

# Create your views here.
def index(request):

     return render(request, 'hatdraw/index.html')

def assign_tasks(request):
     if request.method == 'POST':
          print(request.POST.get('hatdata'))
          names = request.POST.get('names')
          tasks = request.POST.get('tasks')
          discard = request.POST.get('discard')
          data = {'names':names, 'tasks':tasks, 'discard':discard}
          print(data)
          return JsonResponse(data, safe=False)
     else:
          return render(request, 'hatdraw/index.html')#, {'form': form})