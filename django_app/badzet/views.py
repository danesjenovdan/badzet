from django.shortcuts import render
from django.forms.models import model_to_dict
from django.http import JsonResponse
import json

from .models import Budget

# Create your views here.
FIELDS = ['subject', 'konto', 'revenue_expenses', 'classification', 'name', 'money', 'year']


def get_data(request):
    budgets = Budget.objects.all()
    data = [model_to_dict(budget,
                          fields=FIELDS,
                          exclude=[])
            for budget in budgets]

    return JsonResponse(data, safe=False)


def set_data(request):
    if request.POST:
        data = json.loads(request.content)
        Budget(subject=data['subject'],
               konto=data['konto'],
               revenue_expenses=data['classification'],
               name=data['name'],
               money=data['money'],
               yeat=data['year']).save()
        return JsonResponse({"saved": True})
    else:
        return JsonResponse({"saved": False})
