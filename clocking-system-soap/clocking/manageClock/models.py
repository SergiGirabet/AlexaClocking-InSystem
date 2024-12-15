from django.db import models
from django.db.models.fields import CharField

# Create your models here.
class Clocking(models.Model):
    name = models.CharField(max_length=255)
    timestamp = models.DateTimeField()
    OPTIONS = (
        (0, 'in'),
        (1, 'out')
    )
    type = models.IntegerField(choices=OPTIONS)

    def __str__(self):
        return self.name