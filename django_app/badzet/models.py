from django.db import models


class Timestampable(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Budget(Timestampable, models.Model):
	subject =  models.CharField(max_length=256, blank=True, null=True)
	konto =  models.IntegerField(max_length=256, blank=True, null=True)
	revenue_expenses =  models.CharField(max_length=256, blank=True, null=True)
	classification =  models.CharField(max_length=256, blank=True, null=True)
	name =  models.CharField(max_length=256, blank=True, null=True)
	money =  models.FloatField(blank=True, null=True)
	year =  models.IntegerField(max_length=256, blank=True, null=True)
	