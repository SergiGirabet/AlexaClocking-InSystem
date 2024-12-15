from spyne.model.complex import ComplexModel
from spyne.model.primitive import Integer, String, Boolean
from spyne import Array


class Response(ComplexModel):

    response = String(encoding='iso-8859-1')
    class Meta:
        verbose_name = 'Response'

    

    