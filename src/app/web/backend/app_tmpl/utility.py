import jwt
import settings

def getUsernamefromToken(request):
    sso = request.headers.get('sso')
    if sso is not None:
        return settings.PIRELLI_USER
    else:
        authorization_headers = request.headers.get('Authorization')
        if authorization_headers:
            token = authorization_headers.split(" ")[1]
            # Decodifica il token
            decoded_token = jwt.decode(token, options={"verify_signature": False})
            print(decoded_token)

            # Recupera il campo 'user_name' dal token
            user_name = decoded_token.get('user_name')

            # Stampa il nome utente
            print("Nome utente:", user_name)
            return user_name
        return ""