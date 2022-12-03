from django.shortcuts import render
from random import shuffle
from django.http import HttpResponseRedirect
from .forms import HatForm
from django.urls import reverse

# Create your views here.
def index(request):
     return render(request, 'hatdraw/index.html')

def assignTasks(request):
     
     if request.method == 'POST':
          try:
               form = HatForm(request.POST)

               if form.is_valid():

                    form.save()          
                    
                    return HttpResponseRedirect(reverse('hatdraw:index'))
          except:
               pass
          
          else:
               form = HatForm()
     
     return render(request, 'hatdraw/index.html', {'form': form})