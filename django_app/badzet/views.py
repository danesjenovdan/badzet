from django.shortcuts import render
from django.forms.models import model_to_dict
from django.http import JsonResponse
import json
from django.db.models import Sum

from .models import Budget

# Create your views here.
FIELDS = ['subject', 'konto', 'revenue_expenses', 'classification', 'name', 'money', 'year']
TEXT_FIELDS = ['subject', 'name', 'revenue_expenses', 'classification', 'konto']


def get_data(request):
    budgets = filter_model(request, Budget.objects.all())
    data = [model_to_dict(budget,
                          fields=FIELDS,
                          exclude=[])
            for budget in budgets]
    classifications = list(set(list(budgets.values_list('classification',
                                                        flat=True))))

    return JsonResponse({'data': data,
                         'classifications': classifications}, safe=False)


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


def filter_model(request, objects):
    for field in TEXT_FIELDS:
        data = request.GET.get(field, None)
        if data:
            q_objects = Q()
            for text in data.split('|'):
                args = {}
                args[field + '__icontains'] = text
                q_objects |= Q(**args)

    objects = objects.filter(q_objects)

    data = request.GET.get('year', None)
    if data:
        years = list(map(int, data.split(',')))
        objects = objects.filter(year__in=years)

    data = request.GET.get('money', None)
    if data:
        money = list(map(int, data.split(',')))
        objects = objects.filter(money__gte=money[0],
                                 money__lte=money[1])
    return objects


def groupBy(request, key):
    budgets = filter_model(request, Budget.objects.all())
    budgets = budgets.values(key).annotate(total=Sum('money')).order_by("-total")
    return JsonResponse({'data': list(budgets)})
