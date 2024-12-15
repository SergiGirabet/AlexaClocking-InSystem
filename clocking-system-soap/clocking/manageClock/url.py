from django.urls import re_path
import manageClock.views as view

Clocking_patterns = ([
    re_path(r'^soap_service/', view.soap_application),
], 'clocking')