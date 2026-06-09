from django.shortcuts import render

def index(r):
    return render(r, 'main/index.html')
