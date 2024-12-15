from django.shortcuts import render
from spyne.application import Application
from spyne.decorator import rpc
from spyne.protocol.soap import Soap11
from spyne.server.django import DjangoApplication
from spyne.service import ServiceBase
from django.views.decorators.csrf import csrf_exempt
from spyne.decorator import rpc
from spyne.model.primitive import String
from manageClock.utils.utils import Utils
from manageClock.Models.response import Response
from datetime import datetime
from manageClock.models import Clocking
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.

class ManageClockingActionsView(ServiceBase):


    @rpc(String(nillable=False).customize(min_occurs=1), String(nillable=False).customize(min_occurs=1), _returns=Response)
    def clockIn(self, token, name):
        try:
            Utils.checkToken(token)
            print(token)
            print(name)

            try:

                # Check if the user has an active clock-in without a clock-out
                latest_clock_in = Clocking.objects.filter(
                    name=name, 
                    type=0
                ).latest('timestamp')

                if latest_clock_in:
                    try:
                        # Check if the latest clock-in has a subsequent clock-out
                        clock_out = Clocking.objects.filter(
                            name=name,
                            type=1,
                            timestamp__gt=latest_clock_in.timestamp
                        ).exists()

                        if not clock_out:
                            response = Response()
                            response.response = f"{name} Ya has hecho check-in anteriormente. Primero debes hacer check-out."
                            return response

                    except Clocking.DoesNotExist:
                        pass

            except Clocking.DoesNotExist:
                    pass    
                
            # Get the current timestamp
            timestamp = timezone.localtime().replace(microsecond=0)
            
           
            # Get the user's name
            instance = Clocking.objects.create(name=name, timestamp=timestamp, type=0)
            
            formatted_time = timestamp.strftime("%H:%M:%S")
            response = Response()
            response.response = f"{instance.name} has entrado a las {formatted_time} horas"
            return response
        
        except Exception as error: 
            print(str(error))
            response = Response()
            response.response = str(error)
            return response

    
    @rpc(String(nillable=False).customize(min_occurs=1), String(nillable=False).customize(min_occurs=1), _returns=Response)
    def clockOut(self, token, name):
        try:
            Utils.checkToken(token)
            print(token)
            print(name)

             # Get the current timestamp
            timestamp = timezone.localtime().replace(microsecond=0)

            try:
                # Check if the user has clocked in
                clockIn_entry = Clocking.objects.filter(name=name, type=0).latest('timestamp')
            except Clocking.DoesNotExist:
                # The user has not clocked in
                response = Response()
                response.response = f"{name} Primero tienes que entrar para salir"
                return response
            
            try:
                # Check if the user has clocked out
                clockOut_entry = Clocking.objects.filter(name=name, type=1).latest('timestamp')
                response = Response()
                response.response = f"{clockOut_entry.name} ya has registrado una salida anteriormente. Por favor, para salir tienes que volver a entrar."
                return response
            except Clocking.DoesNotExist:
            
                # The user has not clocked out
                # Create a clocking out entry for the user
                instance = Clocking.objects.create(name=name, timestamp=timestamp, type=1)

                # Calculate the hours and minutes worked
                duration = timestamp - clockIn_entry.timestamp
                total_seconds = duration.total_seconds()
                hours_worked = total_seconds // 3600
                minutes_worked = (total_seconds % 3600) // 60

                formatted_time = timestamp.strftime("%H:%M:%S")
                response = Response()
                response.response = f"{instance.name} has salido a las {formatted_time} horas. Horas trabajadas: {int(hours_worked)} horas {int(minutes_worked)} minutos"
                return response

        except Exception as error: 
            print(str(error))
            response = Response()
            response.response = str(error)
            return response
        
soap_app = Application(
    [ManageClockingActionsView],
    tns='django.soap.clocking',
    in_protocol=Soap11(validator='lxml'),
    out_protocol=Soap11(polymorphic=True),
)


django_soap_application = DjangoApplication(soap_app)
soap_application = csrf_exempt(django_soap_application)