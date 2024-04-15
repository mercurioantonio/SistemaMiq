import traceback
from flask import request, Response
import settings
import json
import requests
from urllib3.exceptions import InsecureRequestWarning
from urllib3 import disable_warnings
import datetime as dt
from azure_ad_verify_token import verify_jwt


def sso_check_user_authorization():
    try:
        print("SINGLE SIGN ON CHECK")
        # Recupera l'autorizzazione bearer dall'header della richiesta
        auth_header = request.headers.get('Authorization')
        if auth_header is not None:
            # Dividi l'autorizzazione bearer per ottenere il token
            auth_type, token = auth_header.split(' ')
            if auth_type == 'Bearer':

                obj = verify_jwt(
                    token=token,
                    valid_audiences=[settings.SSO_CLIENT_ID],
                    issuer="https://sts.windows.net/"+settings.SSO_TENANT_ID+"/",
                    jwks_uri="https://login.microsoftonline.com/" +
                    settings.SSO_TENANT_ID + "/discovery/v2.0/keys",
                    verify=True,
                )
                settings.PIRELLI_USER = obj['unique_name'].split('@')[0]

                pass
            else:
                raise Exception("Header None")
        else:
            raise Exception("Header None")
    except Exception as ex:
        # Altrimenti, restituisci una risposta di errore o effettua un'azione appropriata
        resp = json.dumps({
            'success': False,
            'msg': (str(ex))
        })
        return Response(resp,  mimetype='application/json'), 401


def ldap_check_user_authorization():
    try:
        print("ldap_check_user_authorization")

        # Recupera il cookie e il token di autorizzazione dal tuo contesto o dalla richiesta
        cookie_string = request.headers.get('Cookie')
        a_token_cookie = ""
        if cookie_string:
            cookies = cookie_string.split('; ')
            for c in cookies:
                if c.startswith('a_token='):
                    a_token_cookie = c.split('=')[1]
                    break

        # Recupera l'autorizzazione bearer dall'header della richiesta
        auth_header = request.headers.get('Authorization')
        if auth_header is not None:
            # Dividi l'autorizzazione bearer per ottenere il token
            auth_type, token = auth_header.split(' ')
            if auth_type == 'Bearer':
                # Usa il token di autorizzazione come necessario
                pass

        # Imposta l'header personalizzato nella richiesta
        headers = {
            'Authorization': auth_header,
            'Access-Control-Allow-Credentials': 'true'
        }
    except Exception:
        # Altrimenti, restituisci una risposta di errore o effettua un'azione appropriata
        resp = json.dumps({
            'success': False,
            'msg': 'Generic Error'
        })
        return Response(resp.json(),  mimetype='application/json'), 401

    disable_warnings(InsecureRequestWarning)

    cookie = {'a_token': a_token_cookie}
    # Invoca il servizio REST con l'header personalizzato
    response = requests.get(settings.AUTHENTICATION_SERVER +
                            'is_user_authorized', headers=headers, cookies=cookie, verify=False)

    # Controlla il codice di stato della risposta
    if response.status_code == 200:
        # Se la risposta è 200, allora procedi con la richiesta originale
        print("USER AUTHORIZED")
        pass
    else:
        # Altrimenti, restituisci una risposta di errore o effettua un'azione appropriata
        print("USER NOT AUTHORIZED")
        return Response(response.json(),  mimetype='application/json'), 401


def verify_user_authorization():
    sso = request.headers.get('sso')
    if sso is not None:
        return sso_check_user_authorization()
    else:
        return ldap_check_user_authorization()
