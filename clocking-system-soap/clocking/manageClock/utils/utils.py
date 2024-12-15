from rest_framework.authtoken.models import Token

class Utils:  # Function to check if the given token is valid

    @staticmethod
    def checkToken(token):
        user_with_token = Token.objects.filter(key=token).first()
        if not user_with_token:
            raise Exception(400, "token.invalid")
