import math
from flask import Flask, request, Response, jsonify
from flask_cors import CORS, cross_origin
import numpy as np
from numpy import *
from whitenoise import WhiteNoise
import json
import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime, timedelta
import datetime as dt
from pandas import json_normalize
import base64
from PIL import Image
import pymssql 
import sqlalchemy
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler



app = Flask(__name__)
cors = CORS(app, resources={r'/*': {'origins': [
    r'^https?:\/\/.*dm.*pirelli.*internal\/?.*',
    r'^https?:\/\/.*smartman.*pirelli.*internal\/?.*',
    r'^https?:\/\/.*smartrd.*pirelli.*internal\/?.*',
    r'^https?:\/\/localhost(:[0-9]+)?(\/.*)?$',
    r'^https?:\/\/127\.0\.0\.1(:[0-9]+)?(\/.*)?$',
]}})
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['JSON_AS_ASCII'] = False

app.wsgi_app = WhiteNoise(
    app.wsgi_app, root="../../frontend/", index_file=True, autorefresh=True
)

engine = create_engine("mssql+pymssql://Quality_admin:Sett1m0!@10.130.85.85/Quality_MiQ")

# conn = pyodbc.connect(Driver = '{ODBC Driver 17 for SQL Server}',
#                       Server='10.130.85.85',
#                       Database='Quality_MiQ',
#                       uid = 'Quality_admin',
#                       pwd = 'Sett1m0!')


# Middleware per verificare la validità delle informazioni
# app.before_request(verify_user_authorization)

@app.route('/api/v1/scadenziario', methods=['GET'])
def scadenziario ():
    query_scadenziario_1 = """
    SELECT anno_scadenza, settimana_scadenza, scadenza, cod_miq, data_ult_tarat, scm, denominazione_strumento, localizzazione, freq_tarat_gg, in_uso, addetto_taratura, da_confermare
    FROM TABELLA_MIQ 
    WHERE in_uso = 'true'
    ORDER BY scadenza
    """
    miq_scadenziario = pd.read_sql(query_scadenziario_1, engine)

    query_scadenziario_2 = """
    SELECT anno_scadenza, settimana_scadenza, scadenza, cod_miq, data_ult_tarat, scm, denominazione_strumento, n_cert, localizzazione, freq_tarat_gg, in_uso, addetto_taratura, da_confermare
    FROM TABELLA_PRIMARI
    WHERE in_uso = 'true'
    ORDER BY scadenza
    """
    primari_scadenziario = pd.read_sql(query_scadenziario_2, engine)

    query_periodi = """
    SELECT *
    FROM PERIODI_DI_TARATURA
    """
    periodi_di_taratura = pd.read_sql(query_periodi, engine)

    scadenziario = pd.concat([miq_scadenziario, primari_scadenziario])
    scadenziario = scadenziario.merge(periodi_di_taratura, how='left', on=['freq_tarat_gg'])
    scadenziario = (scadenziario[['anno_scadenza', 'settimana_scadenza', 'scadenza', 'cod_miq', 'data_ult_tarat', 'scm', 'denominazione_strumento', 'n_cert', 'localizzazione', 'intervallo_di_taratura', 'freq_tarat_gg', 'in_uso', 'addetto_taratura', 'da_confermare']]).sort_values('scadenza')
    colonne_int = ['settimana_scadenza', 'scm']
    scadenziario[colonne_int] = scadenziario[colonne_int].astype('Int64').where(pd.notna(scadenziario[colonne_int]), None).astype('str').replace('None', '')
    scadenziario['n_cert'] = scadenziario['n_cert'].astype(str).replace('nan', '').replace('None', 'Da_Inserire')
    scadenziario['data_ult_tarat'] = scadenziario['data_ult_tarat'].dt.strftime('%Y-%m-%d')
    scadenziario_json = scadenziario.fillna(0).to_dict(orient = 'records')
    return jsonify(scadenziario_json)



@app.route('/api/v1/database', methods=['GET'])
def database ():
    
    query_database_1 = """
    SELECT *
    FROM TABELLA_MIQ 
    ORDER BY cod_miq
    """
    miq_database = pd.read_sql(query_database_1, engine)

    query_database_2 = """
    SELECT *
    FROM TABELLA_PRIMARI
    ORDER BY cod_miq
    """
    primari_database = pd.read_sql(query_database_2, engine)

    query_periodi = """
    SELECT *
    FROM PERIODI_DI_TARATURA
    """
    periodi_di_taratura = pd.read_sql(query_periodi, engine)

    

    database = pd.concat([miq_database, primari_database])
    database = database.merge(periodi_di_taratura, how='left', on=['freq_tarat_gg'])
    database = (database[['id', 
                                  'cod_miq', 
                                  'scm', 
                                  'classe', 
                                  'denominazione_strumento', 
                                  'data_ult_tarat', 
                                  'freq_tarat_gg', 
                                  'intervallo_di_taratura',
                                  'scadenza', 
                                  'settimana_scadenza', 
                                  'anno_scadenza', 
                                  'n_cert',
                                  'in_uso',
                                    'in_riparazione',
                                    'denominazione_strumento',
                                    'campo_di_misura',
                                    'risoluzione',
                                    'incertezza',
                                    'toll_tecnica_stabilita',
                                    'toll_tecnica_ripetibilita',
                                    'tolleranza_processo',
                                    'tur',
                                    'capability',
                                    'y_rif',
                                    'T_pre',
                                    'pt_int_A',
                                    'pt_int_B',
                                    'pt_int_C',
                                    'pt_int_D',
                                    'pt_int_E',
                                    'pt_int_F',
                                    'grandezza_misurata',
                                    'unita_di_misura',
                                    'campione_di_riferimento',
                                    'casa_costruttrice',
                                    'modello',
                                    'reparto',
                                    'localizzazione',
                                    'sot',
                                    'addetto_taratura',
                                    'responsabile_taratura',
                                    'umidita_relativa',
                                    'temperatura',
                                    'taratura',
                                    'emissione',
                                    'data_emissione',
                                    'revisione',
                                    'data_revisione',
                                    'matricola',
                                    'note',
                                    'cod_miq_vecchio',
                                    'preparato_da']]).sort_values(['in_uso', 'cod_miq'], ascending=[False, True])
    
    colonne_int = ['settimana_scadenza', 'id', 'scm', 'freq_tarat_gg', 'anno_scadenza']
    colonne_float = ['tur', 'capability', 'y_rif', 'T_pre', 'pt_int_A', 'pt_int_B', 'pt_int_C', 'pt_int_D', 'pt_int_E', 'pt_int_F']
    database[colonne_int] = database[colonne_int].replace('', np.nan).astype('Int64').where(pd.notna(database[colonne_int]), None).astype('str').replace('None', '')
    database[colonne_float] = database[colonne_float].applymap(converti_a_float).replace(np.nan, '')
    database['n_cert'] = database['n_cert'].astype(str).replace('nan', '').replace('None', 'Da_Inserire')
    database['data_ult_tarat'] = database['data_ult_tarat'].dt.strftime('%Y-%m-%d')
    database['scadenza'] = database['scadenza'].dt.strftime('%Y-%m-%d')

    database_numeric = database.select_dtypes(include=[np.number, 'bool']).apply(pd.to_numeric, errors='coerce')
    database_non_numeric = database.select_dtypes(exclude=[np.number, 'bool'])
    database_non_numeric = database_non_numeric.where(pd.notna(database_non_numeric), None)
    database = pd.concat([database_numeric, database_non_numeric], axis=1)

    
    database_json = database.fillna('').to_dict(orient='records')

    response_object = {'status': 'success'}   
    response_object['database_json'] = database_json

    return jsonify(response_object)

def converti_a_float(valore):
    try:
        # Verifica se la stringa è vuota
        if valore:
            # Sostituisci la virgola con un punto e converti a float
            return float(valore.replace(',', '.'))
        else:
            # Se la stringa è vuota, restituisci NaN o un valore di default
            return None  # Puoi usare anche float('nan') se preferisci avere NaN come valore vuoto
    except ValueError:
        # Se la conversione fallisce, gestisci il caso restituendo un valore speciale (ad esempio, NaN)
        return valore

@app.route('/api/v1/appendDatabase', methods=['POST'])
def appendDatabase ():
    if request.method == 'POST':
        post_data = request.get_json()
        df = pd.DataFrame(post_data, index=[0])
        if df['cod_miq'][0] != '':
            df['data_ult_tarat'][0] = pd.to_datetime(pd.to_datetime(df['data_ult_tarat'][0], errors='coerce').strftime('%Y-%m-%d'))

            query_periodi = """
                SELECT *
                FROM PERIODI_DI_TARATURA
                """
            periodi_di_taratura = pd.read_sql(query_periodi, engine)
            for index, row in periodi_di_taratura.iterrows():
                 if row['intervallo_di_taratura'] == df['intervallo_di_taratura'][0]:
                    df['freq_tarat_gg'][0] =pd.to_numeric(row['freq_tarat_gg'], errors='coerce')           

            # df['freq_tarat_gg'][0] = pd.to_numeric(df['freq_tarat_gg'][0], errors='coerce').astype(int)
            df['scadenza'][0] = pd.to_datetime((pd.to_datetime(df['data_ult_tarat'][0]) + pd.to_timedelta(df['freq_tarat_gg'][0], unit="D")).strftime('%Y-%m-%d'))
            df['anno_scadenza'][0] = df['scadenza'][0].strftime('%Y')
            df['settimana_scadenza'][0] = df['scadenza'][0].strftime('%W')
            df['freq_tarat_gg'][0] = str(df['freq_tarat_gg'][0])
            df = df.drop(columns='intervallo_di_taratura')
            response_object = {'status': 'success'}
            if not df.empty:
                if df['scm'][0] != '0':
                    df = df.drop(columns=['n_cert', 'id'])
                    df.to_sql('TABELLA_MIQ', engine, index=False, if_exists='append')   
                    response_object['message'] = "Inserimento effettuato"       
                else:
                    df = df.drop(columns=['id'])
                    df.to_sql('TABELLA_PRIMARI', engine, index=False, if_exists='append')  
                    response_object['message'] = "Inserimento effettuato" 
            
            database()
        else:
            response_object = {'status': 'failed'} 
            response_object['message'] = "Inserimento fallito" 
            
    return jsonify(response_object)

@app.route('/api/v1/changeFrequency', methods=['POST'])
def changeFrequency ():
    if request.method == 'POST':
        data = request.get_json()
        scm = data['scm']
        cod_miq = data['cod_miq']
        periodo_prec = data['periodo_prec']
        data_ult_tarat = data['data']

        # Crea un DataFrame con i dati ricevuti
        df = pd.DataFrame({
            'scm': [scm],
            'cod_miq': [cod_miq],
            'periodo_prec': [periodo_prec],
            'data_ult_tarat': [data_ult_tarat]
        })
        print(df)

        if not df.empty:
            query_periodi = """
                            SELECT freq_tarat_gg
                            FROM PERIODI_DI_TARATURA
                            WHERE intervallo_di_taratura = '{}'            
            """.format(df['periodo_prec'][0])
            periodi = pd.read_sql(query_periodi, engine)
            print(periodi)

        if df['scm'][0] != '0':
            new_scadenza = pd.to_datetime((pd.to_datetime(df['data_ult_tarat'][0]) + pd.to_timedelta(periodi['freq_tarat_gg'][0], unit="D")).strftime('%Y-%m-%d'))
            anno_scadenza = new_scadenza.strftime('%Y')
            settimana_scadenza = new_scadenza.strftime('%W')
            with engine.connect() as connection:
                update_frequency = """
                                UPDATE TABELLA_MIQ
                                SET  freq_tarat_gg = {}, scadenza = '{}', anno_scadenza = {}, settimana_scadenza = {}
                                WHERE cod_miq = '{}'
                        """.format(periodi['freq_tarat_gg'][0], new_scadenza, anno_scadenza, settimana_scadenza, df['cod_miq'][0])
                res = connection.execute(update_frequency)
                res.close()
        else:
            with engine.connect() as connection:
                update_frequency = """UPDATE TABELLA_PRIMARI
                                SET freq_tarat_gg = {}, scadenza = '{}', anno_scadenza = {}, settimana_scadenza = {}
                                WHERE cod_miq = '{}'
                        """.format(periodi['freq_tarat_gg'][0], new_scadenza, anno_scadenza, settimana_scadenza, df['cod_miq'][0])
                res = connection.execute(update_frequency)
                res.close()

        response_object = {'status': 'success'}

    return jsonify(response_object)

@app.route('/api/v1/esporta', methods=['GET'])
def esporta ():
    if request.method == 'GET':
        query_database_1 = """
        SELECT *
        FROM TABELLA_MIQ 
        ORDER BY cod_miq
        """
        miq_database = pd.read_sql(query_database_1, engine)

        query_database_2 = """
        SELECT *
        FROM TABELLA_PRIMARI
        ORDER BY cod_miq
        """
        primari_database = pd.read_sql(query_database_2, engine)

        query_periodi = """
        SELECT *
        FROM PERIODI_DI_TARATURA
        """
        periodi_di_taratura = pd.read_sql(query_periodi, engine)

        

        database = pd.concat([miq_database, primari_database])
        database = database.merge(periodi_di_taratura, how='left', on=['freq_tarat_gg'])
        database = (database[['id', 
                                    'cod_miq', 
                                    'scm', 
                                    'classe', 
                                    'denominazione_strumento', 
                                    'data_ult_tarat', 
                                    'freq_tarat_gg', 
                                    'intervallo_di_taratura',
                                    'scadenza', 
                                    'settimana_scadenza', 
                                    'anno_scadenza', 
                                    'n_cert',
                                    'in_uso',
                                        'in_riparazione',
                                        'denominazione_strumento',
                                        'campo_di_misura',
                                        'risoluzione',
                                        'incertezza',
                                        'toll_tecnica_stabilita',
                                        'toll_tecnica_ripetibilita',
                                        'tolleranza_processo',
                                        'tur',
                                        'capability',
                                        'y_rif',
                                        'T_pre',
                                        'pt_int_A',
                                        'pt_int_B',
                                        'pt_int_C',
                                        'pt_int_D',
                                        'pt_int_E',
                                        'pt_int_F',
                                        'grandezza_misurata',
                                        'unita_di_misura',
                                        'campione_di_riferimento',
                                        'casa_costruttrice',
                                        'modello',
                                        'reparto',
                                        'localizzazione',
                                        'sot',
                                        'addetto_taratura',
                                        'responsabile_taratura',
                                        'umidita_relativa',
                                        'temperatura',
                                        'taratura',
                                        'emissione',
                                        'data_emissione',
                                        'revisione',
                                        'data_revisione',
                                        'matricola',
                                        'note',
                                        'cod_miq_vecchio',
                                        'preparato_da']]).sort_values(['in_uso', 'cod_miq'], ascending=[False, True])
        
        colonne_int = ['settimana_scadenza', 'id', 'scm', 'freq_tarat_gg', 'anno_scadenza']
        colonne_float = ['tur', 'capability', 'y_rif', 'T_pre', 'pt_int_A', 'pt_int_B', 'pt_int_C', 'pt_int_D', 'pt_int_E', 'pt_int_F']
        database[colonne_int] = database[colonne_int].replace('', np.nan).astype('Int64').where(pd.notna(database[colonne_int]), None).astype('str').replace('None', '')
        database[colonne_float] = database[colonne_float].applymap(converti_a_float).replace(np.nan, '')
        database['n_cert'] = database['n_cert'].astype(str).replace('nan', '').replace('None', 'Da_Inserire')
        database['data_ult_tarat'] = database['data_ult_tarat'].dt.strftime('%Y-%m-%d')
        database['scadenza'] = database['scadenza'].dt.strftime('%Y-%m-%d')

        database_numeric = database.select_dtypes(include=[np.number, 'bool']).apply(pd.to_numeric, errors='coerce')
        database_non_numeric = database.select_dtypes(exclude=[np.number, 'bool'])
        database_non_numeric = database_non_numeric.where(pd.notna(database_non_numeric), None)
        database = pd.concat([database_numeric, database_non_numeric], axis=1)
        
        try:
            database.replace(r'^=.*$', '', regex=True, inplace=True)
            #Cambiare il percorso quando si carica sul docker di Ubuntu
            #######REPLACEME######
            database.to_excel('database_MIQ.xlsx', index=False)
            # database.to_excel('/mnt/Public/Laboratorio/Salame1/MIQ/MIQ_POLO/MIQ/database_MIQ.xlsx', index=False)
            response_object = {'status': 'success'}
        except Exception as e:
            response_object = {'status': 'failed'}
            (f"Si è verificato un errore: {str(e)}")
    return jsonify(response_object)

@app.route('/api/v1/esportaScadenziario', methods=['GET'])
def esportaScadenziario ():
    if request.method == 'GET':
        query_scadenziario_1 = """
        SELECT anno_scadenza, settimana_scadenza, scadenza, cod_miq, data_ult_tarat, scm, denominazione_strumento, localizzazione, freq_tarat_gg, in_uso, addetto_taratura, da_confermare
        FROM TABELLA_MIQ 
        WHERE in_uso = 'true'
        ORDER BY scadenza
        """
        miq_scadenziario = pd.read_sql(query_scadenziario_1, engine)

        query_scadenziario_2 = """
        SELECT anno_scadenza, settimana_scadenza, scadenza, cod_miq, data_ult_tarat, scm, denominazione_strumento, n_cert, localizzazione, freq_tarat_gg, in_uso, addetto_taratura, da_confermare
        FROM TABELLA_PRIMARI
        WHERE in_uso = 'true'
        ORDER BY scadenza
        """
        primari_scadenziario = pd.read_sql(query_scadenziario_2, engine)

        query_periodi = """
        SELECT *
        FROM PERIODI_DI_TARATURA
        """
        periodi_di_taratura = pd.read_sql(query_periodi, engine)

        scadenziario = pd.concat([miq_scadenziario, primari_scadenziario])
        scadenziario = scadenziario.merge(periodi_di_taratura, how='left', on=['freq_tarat_gg'])
        scadenziario = (scadenziario[['anno_scadenza', 'settimana_scadenza', 'scadenza', 'cod_miq', 'data_ult_tarat', 'scm', 'denominazione_strumento', 'n_cert', 'localizzazione', 'intervallo_di_taratura', 'freq_tarat_gg', 'addetto_taratura']]).sort_values('scadenza')
        colonne_int = ['settimana_scadenza', 'scm']
        scadenziario[colonne_int] = scadenziario[colonne_int].astype('Int64').where(pd.notna(scadenziario[colonne_int]), None).astype('str').replace('None', '')
        scadenziario['n_cert'] = scadenziario['n_cert'].astype(str).replace('nan', '').replace('None', 'Da_Inserire')
        scadenziario['data_ult_tarat'] = scadenziario['data_ult_tarat'].dt.strftime('%Y-%m-%d')     
        
        try:
            scadenziario.replace(r'^=.*$', '', regex=True, inplace=True)
            #Cambiare il percorso quando si carica sul docker di Ubuntu
            #######REPLACEME######
            scadenziario.to_excel('scadenziario_MIQ.xlsx', index=False)
            # scadenziario.to_excel('/mnt/Public/Laboratorio/Salame1/MIQ/MIQ_POLO/MIQ/scadenziario_MIQ.xlsx', index=False)
            response_object = {'status': 'success'}
        except Exception as e:
            response_object = {'status': 'failed'}
            (f"Si è verificato un errore: {str(e)}")
    return jsonify(response_object)

def replace_strings(value):
    if isinstance(value, str):
        return value.replace("'", "''")
    return value

@app.route('/api/v1/updateDatabase', methods=['POST'])
def updateDatabase ():
    if request.method == 'POST':
        post_data = request.get_json()
        print(post_data)
        df = post_data['data']
        df = pd.DataFrame(df, index=[0])
        df['data_ult_tarat'][0] = pd.to_datetime(pd.to_datetime(df['data_ult_tarat'][0], errors='coerce').strftime('%Y-%m-%d'))
        query_periodi = """
            SELECT *
            FROM PERIODI_DI_TARATURA
            """
        periodi_di_taratura = pd.read_sql(query_periodi, engine)
        for index, row in periodi_di_taratura.iterrows():
                if row['intervallo_di_taratura'] == df['intervallo_di_taratura'][0]:
                    df['freq_tarat_gg'][0] =pd.to_numeric(row['freq_tarat_gg'], errors='coerce')     

        df['scadenza'][0] = pd.to_datetime((pd.to_datetime(df['data_ult_tarat'][0]) + pd.to_timedelta(df['freq_tarat_gg'][0], unit="D")).strftime('%Y-%m-%d'))
        df['anno_scadenza'][0] = df['scadenza'][0].strftime('%Y')
        df['settimana_scadenza'][0] = df['scadenza'][0].strftime('%W')
        df['freq_tarat_gg'][0] = str(df['freq_tarat_gg'][0])

        update = df.copy()
        if not update.empty:
            if update['scm'][0] != '0':
                with engine.connect() as connection:
                    update = update.applymap(replace_strings)
                    
                    udpate_data = """UPDATE TABELLA_MIQ
                                    SET cod_miq = '{}', scm = '{}', classe = '{}', denominazione_strumento = '{}', data_ult_tarat = '{}', freq_tarat_gg = '{}', scadenza = '{}', settimana_scadenza = '{}', anno_scadenza = '{}',
                                        in_uso = '{}', in_riparazione = '{}',  campo_di_misura = '{}', risoluzione  = '{}', incertezza = '{}', toll_tecnica_stabilita = '{}', toll_tecnica_ripetibilita = '{}', tolleranza_processo = '{}', tur = '{}', capability = '{}', y_rif = '{}', T_pre = '{}', pt_int_A = '{}', pt_int_B = '{}', pt_int_C = '{}', pt_int_D = '{}', pt_int_E = '{}', pt_int_F = '{}',
                                        grandezza_misurata = '{}', unita_di_misura = '{}', campione_di_riferimento = '{}', casa_costruttrice = '{}', modello = '{}', reparto = '{}', localizzazione = '{}', sot = '{}', addetto_taratura = '{}', responsabile_taratura = '{}', umidita_relativa = '{}', temperatura = '{}', taratura = '{}', emissione = '{}', data_emissione = '{}', revisione = '{}', data_revisione = '{}',
                                        matricola = '{}', note = '{}', cod_miq_vecchio = '{}', preparato_da = '{}'
                                    WHERE id = '{}'
                            """.format(update['cod_miq'][0], update['scm'][0], update['classe'][0], update['denominazione_strumento'][0], update['data_ult_tarat'][0], update['freq_tarat_gg'][0], update['scadenza'][0], update['settimana_scadenza'][0], update['anno_scadenza'][0], 
                                        update['in_uso'][0], update['in_riparazione'][0], update['campo_di_misura'][0], update['risoluzione'][0], update['incertezza'][0], update['toll_tecnica_stabilita'][0], update['toll_tecnica_ripetibilita'][0], update['tolleranza_processo'][0], update['tur'][0], update['capability'][0], update['y_rif'][0], update['T_pre'][0], update['pt_int_A'][0], update['pt_int_B'][0], update['pt_int_C'][0], update['pt_int_D'][0], update['pt_int_E'][0], update['pt_int_F'][0],
                                        update['grandezza_misurata'][0], update['unita_di_misura'][0], update['campione_di_riferimento'][0], update['casa_costruttrice'][0], update['modello'][0], update['reparto'][0], update['localizzazione'][0], update['sot'][0], update['addetto_taratura'][0], update['responsabile_taratura'][0], update['umidita_relativa'][0], update['temperatura'][0], update['taratura'][0], update['emissione'][0], update['data_emissione'][0], update['revisione'][0], update['data_revisione'][0], 
                                        update['matricola'][0], update['note'][0], update['cod_miq_vecchio'][0], update['preparato_da'][0],
                                        update['id'][0])
                    res = connection.execute(udpate_data)
                    res.close()
            else:
                with engine.connect() as connection:
                    update = update.applymap(replace_strings)
                    
                    udpate_data = """UPDATE TABELLA_PRIMARI
                                    SET cod_miq = '{}', scm = '{}', classe = '{}', denominazione_strumento = '{}', data_ult_tarat = '{}', freq_tarat_gg = '{}', scadenza = '{}', settimana_scadenza = '{}', anno_scadenza = '{}',
                                        in_uso = '{}', in_riparazione = '{}', n_cert = '{}', campo_di_misura = '{}', risoluzione  = '{}', incertezza = '{}', toll_tecnica_stabilita = '{}', toll_tecnica_ripetibilita = '{}', tolleranza_processo = '{}', tur = '{}', capability = '{}', y_rif = '{}', T_pre = '{}', pt_int_A = '{}', pt_int_B = '{}', pt_int_C = '{}', pt_int_D = '{}', pt_int_E = '{}', pt_int_F = '{}',
                                        grandezza_misurata = '{}', unita_di_misura = '{}', campione_di_riferimento = '{}', casa_costruttrice = '{}', modello = '{}', reparto = '{}', localizzazione = '{}', sot = '{}', addetto_taratura = '{}', responsabile_taratura = '{}', umidita_relativa = '{}', temperatura = '{}', taratura = '{}', emissione = '{}', data_emissione = '{}', revisione = '{}', data_revisione = '{}',
                                        matricola = '{}', note = '{}', cod_miq_vecchio = '{}', preparato_da = '{}'
                                    WHERE id = '{}'
                            """.format(update['cod_miq'][0], update['scm'][0], update['classe'][0], update['denominazione_strumento'][0], update['data_ult_tarat'][0], update['freq_tarat_gg'][0], update['scadenza'][0], update['settimana_scadenza'][0], update['anno_scadenza'][0], 
                                        update['in_uso'][0], update['in_riparazione'][0], update['n_cert'][0], update['campo_di_misura'][0], update['risoluzione'][0], update['incertezza'][0], update['toll_tecnica_stabilita'][0], update['toll_tecnica_ripetibilita'][0], update['tolleranza_processo'][0], update['tur'][0], update['capability'][0], update['y_rif'][0], update['T_pre'][0], update['pt_int_A'][0], update['pt_int_B'][0], update['pt_int_C'][0], update['pt_int_D'][0], update['pt_int_E'][0], update['pt_int_F'][0],
                                        update['grandezza_misurata'][0], update['unita_di_misura'][0], update['campione_di_riferimento'][0], update['casa_costruttrice'][0], update['modello'][0], update['reparto'][0], update['localizzazione'][0], update['sot'][0], update['addetto_taratura'][0], update['responsabile_taratura'][0], update['umidita_relativa'][0], update['temperatura'][0], update['taratura'][0], update['emissione'][0], update['data_emissione'][0], update['revisione'][0], update['data_revisione'][0], 
                                        update['matricola'][0], update['note'][0], update['cod_miq_vecchio'][0], update['preparato_da'][0],
                                        update['id'][0])
                    res = connection.execute(udpate_data)
                    res.close()

        response_object = {'status': 'success'}

    return jsonify(response_object)


@app.route('/api/v1/cancelDatabase', methods=['POST'])
def cancelDatabase ():
    if request.method == 'POST':
        post_data = request.get_json()
        update = post_data['data']
        update = pd.DataFrame(update, index=[0])
        update['data_ult_tarat'][0] = pd.to_datetime(update['data_ult_tarat'][0])
        update['scadenza'][0] = pd.to_datetime(update['scadenza'][0])

        if not update.empty:
            if update['scm'][0] != '0':
                with engine.connect() as connection:
                    update = update.applymap(replace_strings)
                                        
                    udpate_data = """UPDATE TABELLA_MIQ
                                    SET cod_miq = '{}', scm = '{}', classe = '{}', denominazione_strumento = '{}', data_ult_tarat = '{}', freq_tarat_gg = '{}', scadenza = '{}', settimana_scadenza = '{}', anno_scadenza = '{}',
                                        in_uso = 'false', in_riparazione = '{}',  campo_di_misura = '{}', risoluzione  = '{}', incertezza = '{}', toll_tecnica_stabilita = '{}', toll_tecnica_ripetibilita = '{}', tolleranza_processo = '{}', tur = '{}', capability = '{}', y_rif = '{}', T_pre = '{}', pt_int_A = '{}', pt_int_B = '{}', pt_int_C = '{}', pt_int_D = '{}', pt_int_E = '{}', pt_int_F = '{}',
                                        grandezza_misurata = '{}', unita_di_misura = '{}', campione_di_riferimento = '{}', casa_costruttrice = '{}', modello = '{}', reparto = '{}', localizzazione = '{}', sot = '{}', addetto_taratura = '{}', responsabile_taratura = '{}', umidita_relativa = '{}', temperatura = '{}', taratura = '{}', emissione = '{}', data_emissione = '{}', revisione = '{}', data_revisione = '{}',
                                        matricola = '{}', note = '{}', cod_miq_vecchio = '{}', preparato_da = '{}'
                                    WHERE id = '{}'
                            """.format(update['cod_miq'][0], update['scm'][0], update['classe'][0], update['denominazione_strumento'][0], update['data_ult_tarat'][0], update['freq_tarat_gg'][0], update['scadenza'][0], update['settimana_scadenza'][0], update['anno_scadenza'][0], 
                                        update['in_riparazione'][0], update['campo_di_misura'][0], update['risoluzione'][0], update['incertezza'][0], update['toll_tecnica_stabilita'][0], update['toll_tecnica_ripetibilita'][0], update['tolleranza_processo'][0], update['tur'][0], update['capability'][0], update['y_rif'][0], update['T_pre'][0], update['pt_int_A'][0], update['pt_int_B'][0], update['pt_int_C'][0], update['pt_int_D'][0], update['pt_int_E'][0], update['pt_int_F'][0],
                                        update['grandezza_misurata'][0], update['unita_di_misura'][0], update['campione_di_riferimento'][0], update['casa_costruttrice'][0], update['modello'][0], update['reparto'][0], update['localizzazione'][0], update['sot'][0], update['addetto_taratura'][0], update['responsabile_taratura'][0], update['umidita_relativa'][0], update['temperatura'][0], update['taratura'][0], update['emissione'][0], update['data_emissione'][0], update['revisione'][0], update['data_revisione'][0], 
                                        update['matricola'][0], update['note'][0], update['cod_miq_vecchio'][0], update['preparato_da'][0],
                                        update['id'][0])
                    res = connection.execute(udpate_data)
                    res.close()
            else:
                with engine.connect() as connection:  
                    update = update.applymap(replace_strings)
                                      
                    udpate_data = """UPDATE TABELLA_PRIMARI
                                    SET cod_miq = '{}', scm = '{}', classe = '{}', denominazione_strumento = '{}', data_ult_tarat = '{}', freq_tarat_gg = '{}', scadenza = '{}', settimana_scadenza = '{}', anno_scadenza = '{}',
                                        in_uso = 'false', in_riparazione = '{}', n_cert = '{}',  campo_di_misura = '{}', risoluzione  = '{}', incertezza = '{}', toll_tecnica_stabilita = '{}', toll_tecnica_ripetibilita = '{}', tolleranza_processo = '{}', tur = '{}', capability = '{}', y_rif = '{}', T_pre = '{}', pt_int_A = '{}', pt_int_B = '{}', pt_int_C = '{}', pt_int_D = '{}', pt_int_E = '{}', pt_int_F = '{}',
                                        grandezza_misurata = '{}', unita_di_misura = '{}', campione_di_riferimento = '{}', casa_costruttrice = '{}', modello = '{}', reparto = '{}', localizzazione = '{}', sot = '{}', addetto_taratura = '{}', responsabile_taratura = '{}', umidita_relativa = '{}', temperatura = '{}', taratura = '{}', emissione = '{}', data_emissione = '{}', revisione = '{}', data_revisione = '{}',
                                        matricola = '{}', note = '{}', cod_miq_vecchio = '{}', preparato_da = '{}'
                                    WHERE id = '{}'
                            """.format(update['cod_miq'][0], update['scm'][0], update['classe'][0], update['denominazione_strumento'][0], update['data_ult_tarat'][0], update['freq_tarat_gg'][0], update['scadenza'][0], update['settimana_scadenza'][0], update['anno_scadenza'][0], 
                                        update['in_riparazione'][0], update['n_cert'][0], update['campo_di_misura'][0], update['risoluzione'][0], update['incertezza'][0], update['toll_tecnica_stabilita'][0], update['toll_tecnica_ripetibilita'][0], update['tolleranza_processo'][0], update['tur'][0], update['capability'][0], update['y_rif'][0], update['T_pre'][0], update['pt_int_A'][0], update['pt_int_B'][0], update['pt_int_C'][0], update['pt_int_D'][0], update['pt_int_E'][0], update['pt_int_F'][0],
                                        update['grandezza_misurata'][0], update['unita_di_misura'][0], update['campione_di_riferimento'][0], update['casa_costruttrice'][0], update['modello'][0], update['reparto'][0], update['localizzazione'][0], update['sot'][0], update['addetto_taratura'][0], update['responsabile_taratura'][0], update['umidita_relativa'][0], update['temperatura'][0], update['taratura'][0], update['emissione'][0], update['data_emissione'][0], update['revisione'][0], update['data_revisione'][0], 
                                        update['matricola'][0], update['note'][0], update['cod_miq_vecchio'][0], update['preparato_da'][0],
                                        update['id'][0])
                    res = connection.execute(udpate_data)
                    res.close()

        response_object = {'status': 'success'}

    return jsonify(response_object)





@app.route('/api/v1/anagrafica', methods=['POST'])
def anagrafica():
    if request.method == 'POST':
        graph_json = None
        response_object = {} 
        cod_miq = json.loads(request.data)['cod_miq']
        cod_miq = cod_miq.replace('"', '')

        query_anagrafica_miq = f"""
        SELECT * 
        FROM dbo.TABELLA_MIQ 
        WHERE cod_miq = '{cod_miq}'
        """.format(cod_miq = cod_miq)
        anagrafica_miq = pd.read_sql(query_anagrafica_miq, engine)

        query_anagrafica_primari = f"""
        SELECT *
        FROM TABELLA_PRIMARI
        WHERE cod_miq = '{cod_miq}'
        """.format(cod_miq = cod_miq)
        anagrafica_primari = pd.read_sql(query_anagrafica_primari, engine)

        query_periodi = """
        SELECT *
        FROM PERIODI_DI_TARATURA
        """
        periodi_di_taratura = pd.read_sql(query_periodi, engine)

        anagrafica_json = pd.concat([anagrafica_miq, anagrafica_primari])
        anagrafica_json = anagrafica_json.merge(periodi_di_taratura, how='left', on=['freq_tarat_gg'])
        #Cambiare il percorso quando si carica sul docker di Ubuntu
        #######REPLACEME######
        image_path = "L:/Laboratorio/Salame1/MIQ/MIQ_POLO/MIQ/foto_MIQ/" + cod_miq + ".jpg"
        # image_path = "/mnt/Public/Laboratorio/Salame1/MIQ/MIQ_POLO/MIQ/foto_MIQ/" + cod_miq + ".jpg"
       
        try:
            # Apre l'immagine utilizzando PIL
            with open(image_path, 'rb') as image_file:
                image_data = image_file.read()

            # Codifica l'immagine in Base64
            base64_encoded = base64.b64encode(image_data).decode('utf-8')
            anagrafica_json['image'] = base64_encoded
            print("L'immagine è stata codificata in Base64 con successo.")

            # Ora puoi utilizzare la variabile base64_encoded come stringa Base64
        except Exception as e:
            (f"Si è verificato un errore: {str(e)}")
        
        if not anagrafica_json.empty:
            columns_to_replace = ['pt_int_A', 'pt_int_B', 'pt_int_C', 'pt_int_D', 'pt_int_E', 'pt_int_F']

            for column in columns_to_replace:
                anagrafica_json[column] = anagrafica_json[column].replace(np.NaN, '')

            if (str(anagrafica_json['pt_int_A'][0]) == '' and str(anagrafica_json['pt_int_B'][0]) == '' and str(anagrafica_json['pt_int_C'][0]) == '' and str(anagrafica_json['pt_int_D'][0]) == '' and str(anagrafica_json['pt_int_E'][0]) == '' and str(anagrafica_json['pt_int_F'][0]) == ''):
                if ('+' in anagrafica_json['campione_di_riferimento'][0] and anagrafica_json['scm'][0] != 0):
                    parti = anagrafica_json['campione_di_riferimento'][0].split('+')
                    parti_pulite = [parte.strip() for parte in parti]
                    df = pd.DataFrame({f'Parte{i+1}': [parte] for i, parte in enumerate(parti_pulite)})

                    for colonna in df.columns:
                        flag = 0
                        campione_di_riferimento = df[colonna][0]
                        query_anagrafica_miq = f"""
                            SELECT * 
                            FROM dbo.TABELLA_MIQ 
                            WHERE cod_miq = '{campione_di_riferimento}'
                            """.format(campione_di_riferimento = campione_di_riferimento)
                        anagrafica_campione_miq = pd.read_sql(query_anagrafica_miq, engine)

                        query_anagrafica_primari = f"""
                            SELECT *
                            FROM TABELLA_PRIMARI
                            WHERE cod_miq = '{campione_di_riferimento}'
                            """.format(campione_di_riferimento = campione_di_riferimento)
                        anagrafica_campione_primari = pd.read_sql(query_anagrafica_primari, engine)
                        anagrafica_campione = pd.concat([anagrafica_campione_miq, anagrafica_campione_primari])
                        
                        if not anagrafica_campione.empty:
                            columns_to_replace = ['pt_int_A', 'pt_int_B', 'pt_int_C', 'pt_int_D', 'pt_int_E', 'pt_int_F']

                        for column in columns_to_replace:
                            anagrafica_campione[column] = anagrafica_campione[column].replace(np.NaN, '')

                        if str(anagrafica_json['pt_int_A'][0]) == '' and flag == 0:
                            anagrafica_json.at[0, 'pt_int_A'] = anagrafica_campione.at[0, 'pt_int_A']
                            if str(anagrafica_campione['pt_int_B'][0]) == '':
                                flag = 1
                            else:
                                anagrafica_json.at[0, 'pt_int_B'] = anagrafica_campione.at[0, 'pt_int_B']
                                flag = 1

                        if str(anagrafica_json['pt_int_B'][0]) == '' and flag == 0:
                            anagrafica_json.at[0, 'pt_int_B'] = anagrafica_campione.at[0, 'pt_int_A']
                            if str(anagrafica_campione['pt_int_C'][0]) == '':
                                flag = 1
                            else:
                                anagrafica_json.at[0, 'pt_int_C'] = anagrafica_campione.at[0, 'pt_int_C']
                                flag = 1

                        if str(anagrafica_json['pt_int_C'][0]) == '' and flag == 0:
                            anagrafica_json.at[0, 'pt_int_C'] = anagrafica_campione.at[0, 'pt_int_A']
                            if str(anagrafica_campione['pt_int_D'][0]) == '':
                                flag = 1
                            else:
                                anagrafica_json.at[0, 'pt_int_D'] = anagrafica_campione.at[0, 'pt_int_D']
                                flag = 1

                        if str(anagrafica_json['pt_int_D'][0]) == '' and flag == 0:
                            anagrafica_json.at[0, 'pt_int_D'] = anagrafica_campione.at[0, 'pt_int_A']
                            if str(anagrafica_campione['pt_int_E'][0]) == '':
                                flag = 1
                            else:
                                anagrafica_json.at[0, 'pt_int_E'] = anagrafica_campione.at[0, 'pt_int_E']
                                flag = 1
                        if str(anagrafica_json['pt_int_E'][0]) == '' and flag == 0:
                            anagrafica_json.at[0, 'pt_int_E'] = anagrafica_campione.at[0, 'pt_int_A']
                            if str(anagrafica_campione['pt_int_F'][0]) == '':
                                flag = 1
                            else:
                                anagrafica_json.at[0, 'pt_int_F'] = anagrafica_campione.at[0, 'pt_int_F']
                                flag = 1
                        if str(anagrafica_json['pt_int_F'][0]) == '' and flag == 0:
                            anagrafica_json.at[0, 'pt_int_F'] = anagrafica_campione.at[0, 'pt_int_A']
                            flag = 1
                elif ('//' not in anagrafica_json['campione_di_riferimento'][0] and anagrafica_json['scm'][0] != 0 and len(anagrafica_json['campione_di_riferimento'][0]) <= 7):
                    campione_di_riferimento = anagrafica_json['campione_di_riferimento'][0]
                    query_anagrafica_miq = f"""
                        SELECT * 
                        FROM dbo.TABELLA_MIQ 
                        WHERE cod_miq = '{campione_di_riferimento}'
                        """.format(campione_di_riferimento = campione_di_riferimento)
                    anagrafica_campione_miq = pd.read_sql(query_anagrafica_miq, engine)

                    query_anagrafica_primari = f"""
                        SELECT *
                        FROM TABELLA_PRIMARI
                        WHERE cod_miq = '{campione_di_riferimento}'
                        """.format(campione_di_riferimento = campione_di_riferimento)
                    anagrafica_campione_primari = pd.read_sql(query_anagrafica_primari, engine)
                    anagrafica_campione = pd.concat([anagrafica_campione_miq, anagrafica_campione_primari])

                    anagrafica_json['pt_int_A'][0] = anagrafica_campione['pt_int_A'][0]
                    anagrafica_json['pt_int_B'][0] = anagrafica_campione['pt_int_B'][0]
                    anagrafica_json['pt_int_C'][0] = anagrafica_campione['pt_int_C'][0]
                    anagrafica_json['pt_int_D'][0] = anagrafica_campione['pt_int_D'][0]  
                    anagrafica_json['pt_int_E'][0] = anagrafica_campione['pt_int_E'][0]  
                    anagrafica_json['pt_int_F'][0] = anagrafica_campione['pt_int_F'][0]  
                else:
                    print("hai cercato un primario")
                
            
        else:
            response_object = {'status': 'failed'} 
            response_object['anagrafica_json'] = {'status': 'failed'}
         
        if not anagrafica_json.empty:
            anagrafica_json = anagrafica_json.fillna('').to_dict(orient = 'records')
            response_object = {'status': 'success'}
            response_object['anagrafica_json'] = anagrafica_json

        else:
            response_object = {'status': 'failed'} 
            response_object['anagrafica_json'] = {'status': 'failed'}
                             
        return jsonify(response_object)
    
    
@app.route('/api/v1/campione_di_riferimento', methods=['POST'])
def searchCampione():
    if request.method == 'POST':
        response_object = {} 
        dati = json.loads(request.data)
        print(dati)
        campione_di_riferimento = dati['campione']
        campione_di_riferimento = campione_di_riferimento.replace('"','')
        anagrafica_json = pd.DataFrame()
       
        try:
            if ('+' in campione_di_riferimento):
                parti = campione_di_riferimento.split('+')
                parti_pulite = [parte.strip() for parte in parti]
                df = pd.DataFrame({f'Parte{i+1}': [parte] for i, parte in enumerate(parti_pulite)})
                for colonna in df.columns:
                    campione_di_riferimento = df[colonna][0]
                    query_anagrafica_primari = f"""
                    SELECT *
                    FROM TABELLA_PRIMARI
                    WHERE cod_miq = '{campione_di_riferimento}'
                    """.format(campione_di_riferimento = campione_di_riferimento)
                    campione = pd.read_sql(query_anagrafica_primari, engine)
            
                    query_periodi = """
                    SELECT *
                    FROM PERIODI_DI_TARATURA
                    """
                    periodi_di_taratura = pd.read_sql(query_periodi, engine)
                    campione = campione.merge(periodi_di_taratura, how='left', on=['freq_tarat_gg'])
                    anagrafica_json = pd.concat([anagrafica_json, campione], ignore_index=True)
            else:
                query_anagrafica_primari = f"""
                SELECT *
                FROM TABELLA_PRIMARI
                WHERE cod_miq = '{campione_di_riferimento}'
                """.format(campione_di_riferimento = campione_di_riferimento)
                anagrafica_json = pd.read_sql(query_anagrafica_primari, engine)
        
                query_periodi = """
                SELECT *
                FROM PERIODI_DI_TARATURA
                """
                periodi_di_taratura = pd.read_sql(query_periodi, engine)
                anagrafica_json = anagrafica_json.merge(periodi_di_taratura, how='left', on=['freq_tarat_gg'])
        except Exception as e:
            (f"Si è verificato un errore: {str(e)}")
         
        if not anagrafica_json.empty:
            anagrafica_json = anagrafica_json.fillna('').to_dict(orient = 'records')
            response_object = {'status': 'success'}
            response_object['anagrafica_json'] = anagrafica_json

        else:
            response_object = {'status': 'failed'} 
            response_object['anagrafica_json'] = {'status': 'failed'}
                             
        return jsonify(response_object)
    
@app.route('/api/v1/taratura0', methods=['POST'])
def taratura0():
    response_object = {'status': 'success'}
    if request.method == 'POST':
        post_data = request.get_json()
        misure_dict = json.loads(post_data['misure'])
        misure = pd.DataFrame(misure_dict, index=[0])
        print(misure)
        esito_x = 'True'
        esito_r = 'True'
        flag = 'False'

        if not misure.empty:
            scm = misure['scm'][0]
            del misure['scm']
            del misure['toll_tecnica_stabilita']
            del misure['toll_tecnica_ripetibilita']
            if misure['pt_int_A'][0] == '':
                del misure['pt_int_A']
            if misure['pt_int_B'][0] == '':
                del misure['pt_int_B']
            if misure['pt_int_C'][0] == '':
                del misure['pt_int_C']
            if misure['pt_int_D'][0] == '':
                del misure['pt_int_D']
            if misure['pt_int_E'][0] == '':
                del misure['pt_int_E']
            if misure['pt_int_F'][0] == '':
                del misure['pt_int_F']
            if misure['y_rif'][0] == '':
                del misure['y_rif']
            if misure['T_pre'][0] == '':
                del misure['T_pre']
            if (str(esito_x) == 'True' and str(esito_r) == 'True'):
                query_freq_primari = """
                    SELECT freq_tarat_gg
                    FROM TABELLA_PRIMARI
                    WHERE cod_miq = '{}'
                    """.format(misure['cod_miq'][0])
                freq_tarat_gg = pd.read_sql(query_freq_primari, engine)

                new_scadenza = pd.to_datetime((pd.to_datetime(misure['data'][0]) + pd.to_timedelta(freq_tarat_gg['freq_tarat_gg'][0], unit="D")).strftime('%Y-%m-%d'))
                anno_scadenza = new_scadenza.strftime('%Y')
                settimana_scadenza = new_scadenza.strftime('%W')
                
                with engine.connect() as connection:
                    udpate_data = """UPDATE TABELLA_PRIMARI
                                    SET n_cert = '{}', incertezza = '{}', data_ult_tarat = '{}', scadenza = '{}', anno_scadenza = '{}', settimana_scadenza = '{}', revisione = '{}', data_revisione = '{}'
                                    WHERE cod_miq = '{}'
                    """.format(misure['n_cert'][0], misure['incertezza'][0], misure['data'][0], new_scadenza, anno_scadenza, settimana_scadenza, misure['revisione'][0], misure['data_revisione'][0], misure['cod_miq'][0])
                
                    res = connection.execute(udpate_data)
                    res.close()
            print(misure)
            misure.to_sql('SCM_' + str(scm), engine, index=False, if_exists='append')
            print("scrittura su database")

    response_object['esito_x'] = esito_x
    response_object['esito_r'] = esito_r

    return jsonify(response_object)
    
@app.route('/api/v1/taratura', methods=['POST'])
def taratura():
    response_object = {'status': 'success'}
    if request.method == 'POST':
        post_data = request.get_json()
        misure_dict = json.loads(post_data['misure'])
        misure = pd.DataFrame(misure_dict, index=[0])
        print(misure)
        esito_x = 'False'
        esito_r = 'False'
        flag = 'False'        

        if (str(misure['scm'][0]) != '28' and str(misure['scm'][0]) != '11' and str(misure['scm'][0]) != '0' and str(misure['scm'][0]) != '98'):
            misure['D3'] = 0
            misure['D4'] = 2.114
            misure['d2'] = 2.326

            if misure['pt_int_F'][0] != '':
                colonne_float = ['y_rif', 'T_pre',
                'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A','y4_strum_A', 'y4_master_A','y5_strum_A', 'y5_master_A',
                'pt_int_B', 'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B','y4_strum_B', 'y4_master_B','y5_strum_B', 'y5_master_B', 
                'pt_int_C', 'val_calib_C', 'val_calib_master_C', 'y1_strum_C', 'y1_master_C','y2_strum_C', 'y2_master_C','y3_strum_C', 'y3_master_C','y4_strum_C', 'y4_master_C','y5_strum_C', 'y5_master_C',
                'pt_int_D', 'val_calib_D', 'val_calib_master_D', 'y1_strum_D', 'y1_master_D','y2_strum_D', 'y2_master_D','y3_strum_D', 'y3_master_D','y4_strum_D', 'y4_master_D','y5_strum_D', 'y5_master_D',
                'pt_int_E', 'val_calib_E', 'val_calib_master_E', 'y1_strum_E', 'y1_master_E','y2_strum_E', 'y2_master_E','y3_strum_E', 'y3_master_E','y4_strum_E', 'y4_master_E','y5_strum_E', 'y5_master_E',
                'pt_int_F', 'val_calib_F', 'val_calib_master_F', 'y1_strum_F', 'y1_master_F','y2_strum_F', 'y2_master_F','y3_strum_F', 'y3_master_F','y4_strum_F', 'y4_master_F','y5_strum_F', 'y5_master_F']
                            
            elif misure['pt_int_E'][0] != '':
                colonne_float = ['y_rif', 'T_pre',
                'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A','y4_strum_A', 'y4_master_A','y5_strum_A', 'y5_master_A',
                'pt_int_B', 'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B','y4_strum_B', 'y4_master_B','y5_strum_B', 'y5_master_B', 
                'pt_int_C', 'val_calib_C', 'val_calib_master_C', 'y1_strum_C', 'y1_master_C','y2_strum_C', 'y2_master_C','y3_strum_C', 'y3_master_C','y4_strum_C', 'y4_master_C','y5_strum_C', 'y5_master_C',
                'pt_int_D', 'val_calib_D', 'val_calib_master_D', 'y1_strum_D', 'y1_master_D','y2_strum_D', 'y2_master_D','y3_strum_D', 'y3_master_D','y4_strum_D', 'y4_master_D','y5_strum_D', 'y5_master_D',
                'pt_int_E', 'val_calib_E', 'val_calib_master_E', 'y1_strum_E', 'y1_master_E','y2_strum_E', 'y2_master_E','y3_strum_E', 'y3_master_E','y4_strum_E', 'y4_master_E','y5_strum_E', 'y5_master_E']

            elif misure['pt_int_D'][0] != '':
                colonne_float = ['y_rif', 'T_pre',
                'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A','y4_strum_A', 'y4_master_A','y5_strum_A', 'y5_master_A',
                'pt_int_B', 'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B','y4_strum_B', 'y4_master_B','y5_strum_B', 'y5_master_B', 
                'pt_int_C', 'val_calib_C', 'val_calib_master_C', 'y1_strum_C', 'y1_master_C','y2_strum_C', 'y2_master_C','y3_strum_C', 'y3_master_C','y4_strum_C', 'y4_master_C','y5_strum_C', 'y5_master_C',
                'pt_int_D', 'val_calib_D', 'val_calib_master_D', 'y1_strum_D', 'y1_master_D','y2_strum_D', 'y2_master_D','y3_strum_D', 'y3_master_D','y4_strum_D', 'y4_master_D','y5_strum_D', 'y5_master_D']
                            
            elif misure['pt_int_C'][0] != '':
                colonne_float = ['y_rif', 'T_pre',
                'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A','y4_strum_A', 'y4_master_A','y5_strum_A', 'y5_master_A',
                'pt_int_B', 'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B','y4_strum_B', 'y4_master_B','y5_strum_B', 'y5_master_B', 
                'pt_int_C', 'val_calib_C', 'val_calib_master_C', 'y1_strum_C', 'y1_master_C','y2_strum_C', 'y2_master_C','y3_strum_C', 'y3_master_C','y4_strum_C', 'y4_master_C','y5_strum_C', 'y5_master_C']

            elif misure['pt_int_B'][0] != '':
                if pd.to_numeric(misure['pt_int_B'], errors='coerce').notnull().all() and pd.to_numeric(misure['pt_int_A'], errors='coerce').notnull().all():
                    colonne_float = ['y_rif', 'T_pre',
                    'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A','y4_strum_A', 'y4_master_A','y5_strum_A', 'y5_master_A',
                    'pt_int_B', 'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B','y4_strum_B', 'y4_master_B','y5_strum_B', 'y5_master_B']
                elif pd.to_numeric(misure['pt_int_B'], errors='coerce').notnull().all() and not pd.to_numeric(misure['pt_int_A'], errors='coerce').notnull().all(): 
                    colonne_float = ['y_rif', 'T_pre',
                    'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A','y4_strum_A', 'y4_master_A','y5_strum_A', 'y5_master_A',
                    'pt_int_B', 'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B','y4_strum_B', 'y4_master_B','y5_strum_B', 'y5_master_B']                    
                elif not pd.to_numeric(misure['pt_int_B'], errors='coerce').notnull().all() and pd.to_numeric(misure['pt_int_A'], errors='coerce').notnull().all(): 
                    colonne_float = ['y_rif', 'T_pre',
                    'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A','y4_strum_A', 'y4_master_A','y5_strum_A', 'y5_master_A',
                    'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B','y4_strum_B', 'y4_master_B','y5_strum_B', 'y5_master_B']                
                else:
                    colonne_float = ['y_rif', 'T_pre',
                    'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A','y4_strum_A', 'y4_master_A','y5_strum_A', 'y5_master_A',
                    'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B','y4_strum_B', 'y4_master_B','y5_strum_B', 'y5_master_B']
                
            elif misure['pt_int_A'][0] != '':
                if isinstance(misure['pt_int_A'], float):
                    colonne_float = ['y_rif', 'T_pre',
                    'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A','y4_strum_A', 'y4_master_A','y5_strum_A', 'y5_master_A']
                else:
                    colonne_float = ['y_rif', 'T_pre',
                    'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A','y4_strum_A', 'y4_master_A','y5_strum_A', 'y5_master_A']
            # else:
            #     PASSA O NON PASSA

            misure[colonne_float] = misure[colonne_float].astype(str)
            misure[colonne_float] = misure[colonne_float].applymap(lambda x: x.replace(',','.')).replace('None', np.nan)
            misure[colonne_float] = misure[colonne_float].astype(float)
            
            delta = pd.DataFrame()

            if ( ('%' not in str(misure['toll_tecnica_stabilita'])) & (  'ang' not in str(misure['toll_tecnica_stabilita'])) ):
                if misure['pt_int_A'][0] != '':
                    delta['delta_A'] = (misure['y1_strum_A']-misure['y1_master_A']), (misure['y2_strum_A']-misure['y2_master_A']), (misure['y3_strum_A']-misure['y3_master_A']), (misure['y4_strum_A']-misure['y4_master_A']), (misure['y5_strum_A']-misure['y5_master_A'])
                    misure['avg_x_A'] = (mean(delta['delta_A'])).round(2)
                    misure['avg_x_A'] = misure['avg_x_A'].replace(np.nan, 0.0)
                if misure['pt_int_B'][0] != '':
                    delta['delta_B'] = (misure['y1_strum_B']-misure['y1_master_B']), (misure['y2_strum_B']-misure['y2_master_B']), (misure['y3_strum_B']-misure['y3_master_B']), (misure['y4_strum_B']-misure['y4_master_B']), (misure['y5_strum_B']-misure['y5_master_B'])
                    misure['avg_x_B'] = (mean(delta['delta_B'])).round(2)
                    misure['avg_x_B'] = misure['avg_x_B'].replace(np.nan, 0.0)
                if misure['pt_int_C'][0] != '':
                    delta['delta_C'] = (misure['y1_strum_C']-misure['y1_master_C']), (misure['y2_strum_C']-misure['y2_master_C']), (misure['y3_strum_C']-misure['y3_master_C']), (misure['y4_strum_C']-misure['y4_master_C']), (misure['y5_strum_C']-misure['y5_master_C'])
                    misure['avg_x_C'] = (mean(delta['delta_C'])).round(2)
                    misure['avg_x_C'] = misure['avg_x_C'].replace(np.nan, 0.0)
                if misure['pt_int_D'][0] != '':
                    delta['delta_D'] = (misure['y1_strum_D']-misure['y1_master_D']), (misure['y2_strum_D']-misure['y2_master_D']), (misure['y3_strum_D']-misure['y3_master_D']), (misure['y4_strum_D']-misure['y4_master_D']), (misure['y5_strum_D']-misure['y5_master_D'])
                    misure['avg_x_D'] = (mean(delta['delta_D'])).round(2)
                    misure['avg_x_D'] = misure['avg_x_D'].replace(np.nan, 0.0)
                if misure['pt_int_E'][0] != '':
                    delta['delta_E'] = (misure['y1_strum_E']-misure['y1_master_E']), (misure['y2_strum_E']-misure['y2_master_E']), (misure['y3_strum_E']-misure['y3_master_E']), (misure['y4_strum_E']-misure['y4_master_E']), (misure['y5_strum_E']-misure['y5_master_E'])
                    misure['avg_x_E'] = (mean(delta['delta_E'])).round(2)
                    misure['avg_x_E'] = misure['avg_x_E'].replace(np.nan, 0.0)
                        
                if misure['pt_int_F'][0] != '':
                    delta['delta_F'] = (misure['y1_strum_F']-misure['y1_master_F']), (misure['y2_strum_F']-misure['y2_master_F']), (misure['y3_strum_F']-misure['y3_master_F']), (misure['y4_strum_F']-misure['y4_master_F']), (misure['y5_strum_F']-misure['y5_master_F'])
                    misure['avg_x_F'] = (mean(delta['delta_F'])).round(2)
                    misure['avg_x_F'] = misure['avg_x_F'].replace(np.nan, 0.0)

            if ('%' in str(misure['toll_tecnica_stabilita'])):
                if misure['pt_int_A'][0] != '':
                    delta['delta_A'] = (misure['y1_strum_A']-misure['y1_master_A'])/misure['pt_int_A']*100, (misure['y2_strum_A']-misure['y2_master_A'])/misure['pt_int_A']*100, (misure['y3_strum_A']-misure['y3_master_A'])/misure['pt_int_A']*100, (misure['y4_strum_A']-misure['y4_master_A'])/misure['pt_int_A']*100, (misure['y5_strum_A']-misure['y5_master_A'])/misure['pt_int_A']*100
                    misure['avg_x_A'] = (mean(delta['delta_A'])).round(2)
                    misure['avg_x_A'] = misure['avg_x_A'].replace(np.nan, 0.0)
                if misure['pt_int_B'][0] != '':
                    delta['delta_B'] = (misure['y1_strum_B']-misure['y1_master_B'])/misure['pt_int_B']*100, (misure['y2_strum_B']-misure['y2_master_B'])/misure['pt_int_B']*100, (misure['y3_strum_B']-misure['y3_master_B'])/misure['pt_int_B']*100, (misure['y4_strum_B']-misure['y4_master_B'])/misure['pt_int_B']*100, (misure['y5_strum_B']-misure['y5_master_B'])/misure['pt_int_B']*100
                    misure['avg_x_B'] = (mean(delta['delta_B'])).round(2)
                    misure['avg_x_B'] = misure['avg_x_B'].replace(np.nan, 0.0)
                if misure['pt_int_C'][0] != '':
                    delta['delta_C'] = (misure['y1_strum_C']-misure['y1_master_C'])/misure['pt_int_C']*100, (misure['y2_strum_C']-misure['y2_master_C'])/misure['pt_int_C']*100, (misure['y3_strum_C']-misure['y3_master_C'])/misure['pt_int_C']*100, (misure['y4_strum_C']-misure['y4_master_C'])/misure['pt_int_C']*100, (misure['y5_strum_C']-misure['y5_master_C'])/misure['pt_int_C']*100
                    misure['avg_x_C'] = (mean(delta['delta_C'])).round(2)
                    misure['avg_x_C'] = misure['avg_x_C'].replace(np.nan, 0.0)
                if misure['pt_int_D'][0] != '':
                    delta['delta_D'] = (misure['y1_strum_D']-misure['y1_master_D'])/misure['pt_int_D']*100, (misure['y2_strum_D']-misure['y2_master_D'])/misure['pt_int_D']*100, (misure['y3_strum_D']-misure['y3_master_D'])/misure['pt_int_D']*100, (misure['y4_strum_D']-misure['y4_master_D'])/misure['pt_int_D']*100, (misure['y5_strum_D']-misure['y5_master_D'])/misure['pt_int_D']*100
                    misure['avg_x_D'] = (mean(delta['delta_D'])).round(2)
                    misure['avg_x_D'] = misure['avg_x_D'].replace(np.nan, 0.0)
                if misure['pt_int_E'][0] != '':
                    delta['delta_E'] = (misure['y1_strum_E']-misure['y1_master_E'])/misure['pt_int_E']*100, (misure['y2_strum_E']-misure['y2_master_E'])/misure['pt_int_E']*100, (misure['y3_strum_E']-misure['y3_master_E'])/misure['pt_int_E']*100, (misure['y4_strum_E']-misure['y4_master_E'])/misure['pt_int_E']*100, (misure['y5_strum_E']-misure['y5_master_E'])/misure['pt_int_E']*100
                    misure['avg_x_E'] = (mean(delta['delta_E'])).round(2)
                    misure['avg_x_E'] = misure['avg_x_E'].replace(np.nan, 0.0)
                    
                if misure['pt_int_F'][0] != '':
                    delta['delta_F'] = (misure['y1_strum_F']-misure['y1_master_F'])/misure['pt_int_F']*100, (misure['y2_strum_F']-misure['y2_master_F'])/misure['pt_int_F']*100, (misure['y3_strum_F']-misure['y3_master_F'])/misure['pt_int_F']*100, (misure['y4_strum_F']-misure['y4_master_F'])/misure['pt_int_F']*100, (misure['y5_strum_F']-misure['y5_master_F'])/misure['pt_int_F']*100
                    misure['avg_x_F'] = (mean(delta['delta_F'])).round(2)
                    misure['avg_x_F'] = misure['avg_x_F'].replace(np.nan, 0.0)
            
            if 'ang' in str(misure['toll_tecnica_stabilita']):
                if misure['pt_int_A'][0] != '':
                    delta['delta_A'] = (misure['y1_strum_A']-misure['y1_master_A']), (misure['y2_strum_A']-misure['y2_master_A']), (misure['y3_strum_A']-misure['y3_master_A']), (misure['y4_strum_A']-misure['y4_master_A']), (misure['y5_strum_A']-misure['y5_master_A'])
                    misure['avg_x_A'] = mean(delta['delta_A'])
                    misure['avg_x_A'] = (rad2deg(arctan(misure['avg_x_A']/191.9945))-(misure['pt_int_A'])).round(3)
                if misure['pt_int_B'][0] != '':
                    delta['delta_B'] = (misure['y1_strum_B']-misure['y1_master_B']), (misure['y2_strum_B']-misure['y2_master_B']), (misure['y3_strum_B']-misure['y3_master_B']), (misure['y4_strum_B']-misure['y4_master_B']), (misure['y5_strum_B']-misure['y5_master_B'])
                    misure['avg_x_B'] = mean(delta['delta_B'])
                    misure['avg_x_B'] = (rad2deg(arctan(misure['avg_x_B']/191.9945))-(misure['pt_int_B'])).round(3)
                if misure['pt_int_C'][0] != '':
                    delta['delta_C'] = (misure['y1_strum_C']-misure['y1_master_C']), (misure['y2_strum_C']-misure['y2_master_C']), (misure['y3_strum_C']-misure['y3_master_C']), (misure['y4_strum_C']-misure['y4_master_C']), (misure['y5_strum_C']-misure['y5_master_C'])
                    misure['avg_x_C'] = mean(delta['delta_C'])
                    misure['avg_x_C'] = (rad2deg(arctan(misure['avg_x_C']/191.9945))-(misure['pt_int_C'])).round(3)
                if misure['pt_int_D'][0] != '':
                    delta['delta_D'] = (misure['y1_strum_D']-misure['y1_master_D']), (misure['y2_strum_D']-misure['y2_master_D']), (misure['y3_strum_D']-misure['y3_master_D']), (misure['y4_strum_D']-misure['y4_master_D']), (misure['y5_strum_D']-misure['y5_master_D'])
                    misure['avg_x_D'] = mean(delta['delta_D'])
                    misure['avg_x_D'] = (rad2deg(arctan(misure['avg_x_D']/191.9945))-(misure['pt_int_D'])).round(3)
                if misure['pt_int_E'][0] != '':
                    delta['delta_E'] = (misure['y1_strum_E']-misure['y1_master_E']), (misure['y2_strum_E']-misure['y2_master_E']), (misure['y3_strum_E']-misure['y3_master_E']), (misure['y4_strum_E']-misure['y4_master_E']), (misure['y5_strum_E']-misure['y5_master_E'])
                    misure['avg_x_E'] = mean(delta['delta_E'])
                    misure['avg_x_E'] = (rad2deg(arctan(misure['avg_x_E']/191.9945))-(misure['pt_int_E'])).round(3) 

                if misure['pt_int_F'][0] != '':
                    delta['delta_F'] = (misure['y1_strum_F']-misure['y1_master_F']), (misure['y2_strum_F']-misure['y2_master_F']), (misure['y3_strum_F']-misure['y3_master_F']), (misure['y4_strum_F']-misure['y4_master_F']), (misure['y5_strum_F']-misure['y5_master_F'])
                    misure['avg_x_F'] = mean(delta['delta_F'])
                    misure['avg_x_F'] = (rad2deg(arctan(misure['avg_x_F']/191.9945))-(misure['pt_int_F'])).round(3)            

            delta = delta.reset_index(drop=True).astype(float).replace(np.nan, 0.0)
            misure['LSC_x'] = (misure['y_rif']+0.15*misure['T_pre']/sqrt(5)).round(2)
            misure['LIC_x'] = (misure['y_rif']-0.15*misure['T_pre']/sqrt(5)).round(2)

        if(str(misure['scm'][0]) == '28'):
            misure['D3'] = 0
            misure['D4'] = 2.575
            misure['d2'] = 1.693
            if misure['pt_int_F'][0] != '':
                colonne_float = ['y_rif', 'T_pre',
                'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A',
                'pt_int_B', 'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B',
                'pt_int_C', 'val_calib_C', 'val_calib_master_C', 'y1_strum_C', 'y1_master_C','y2_strum_C', 'y2_master_C','y3_strum_C', 'y3_master_C',
                'pt_int_D', 'val_calib_D', 'val_calib_master_D', 'y1_strum_D', 'y1_master_D','y2_strum_D', 'y2_master_D','y3_strum_D', 'y3_master_D',
                'pt_int_E', 'val_calib_E', 'val_calib_master_E', 'y1_strum_E', 'y1_master_E','y2_strum_E', 'y2_master_E','y3_strum_E', 'y3_master_E',
                'pt_int_F', 'val_calib_F', 'val_calib_master_F', 'y1_strum_F', 'y1_master_F','y2_strum_F', 'y2_master_F','y3_strum_F', 'y3_master_F']
                            
            elif misure['pt_int_E'][0] != '':
                colonne_float = ['y_rif', 'T_pre',
                'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A',
                'pt_int_B', 'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B', 
                'pt_int_C', 'val_calib_C', 'val_calib_master_C', 'y1_strum_C', 'y1_master_C','y2_strum_C', 'y2_master_C','y3_strum_C', 'y3_master_C',
                'pt_int_D', 'val_calib_D', 'val_calib_master_D', 'y1_strum_D', 'y1_master_D','y2_strum_D', 'y2_master_D','y3_strum_D', 'y3_master_D',
                'pt_int_E', 'val_calib_E', 'val_calib_master_E', 'y1_strum_E', 'y1_master_E','y2_strum_E', 'y2_master_E','y3_strum_E', 'y3_master_E']

            elif misure['pt_int_D'][0] != '':
                colonne_float = ['y_rif', 'T_pre',
                'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A',
                'pt_int_B', 'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B',
                'pt_int_C', 'val_calib_C', 'val_calib_master_C', 'y1_strum_C', 'y1_master_C','y2_strum_C', 'y2_master_C','y3_strum_C', 'y3_master_C',
                'pt_int_D', 'val_calib_D', 'val_calib_master_D', 'y1_strum_D', 'y1_master_D','y2_strum_D', 'y2_master_D','y3_strum_D', 'y3_master_D']
                            
            elif misure['pt_int_C'][0] != '':
                colonne_float = ['y_rif', 'T_pre',
                'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A',
                'pt_int_B', 'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B', 
                'pt_int_C', 'val_calib_C', 'val_calib_master_C', 'y1_strum_C', 'y1_master_C','y2_strum_C', 'y2_master_C','y3_strum_C', 'y3_master_C']

            elif misure['pt_int_B'][0] != '':
                colonne_float = ['y_rif', 'T_pre',
                'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A','y4_strum_A',
                'pt_int_B', 'val_calib_B', 'val_calib_master_B', 'y1_strum_B', 'y1_master_B','y2_strum_B', 'y2_master_B','y3_strum_B', 'y3_master_B','y4_strum_B']

            elif misure['pt_int_A'][0] != '':
                colonne_float = ['y_rif', 'T_pre',
                'pt_int_A', 'val_calib_A', 'val_calib_master_A', 'y1_strum_A', 'y1_master_A','y2_strum_A', 'y2_master_A','y3_strum_A', 'y3_master_A']
            # else:
            #     PASSA O NON PASSA

            misure[colonne_float] = misure[colonne_float].astype(str)
            misure[colonne_float] = misure[colonne_float].applymap(lambda x: x.replace(',','.')).replace('None', np.nan)
            misure[colonne_float] = misure[colonne_float].astype(float)
            
            delta = pd.DataFrame()

            if ( ('%' not in str(misure['toll_tecnica_stabilita'])) & (  'ang' not in str(misure['toll_tecnica_stabilita'])) ):
                if misure['pt_int_A'][0] != '':
                    delta['delta_A'] = (misure['y1_strum_A']-misure['y1_master_A']), (misure['y2_strum_A']-misure['y2_master_A']), (misure['y3_strum_A']-misure['y3_master_A'])
                    misure['avg_x_A'] = (mean(delta['delta_A'])).round(2)
                    misure['avg_x_A'] = misure['avg_x_A'].replace(np.nan, 0.0)
                if misure['pt_int_B'][0] != '':
                    delta['delta_B'] = (misure['y1_strum_B']-misure['y1_master_B']), (misure['y2_strum_B']-misure['y2_master_B']), (misure['y3_strum_B']-misure['y3_master_B'])
                    misure['avg_x_B'] = (mean(delta['delta_B'])).round(2)
                    misure['avg_x_B'] = misure['avg_x_B'].replace(np.nan, 0.0)
                if misure['pt_int_C'][0] != '':
                    delta['delta_C'] = (misure['y1_strum_C']-misure['y1_master_C']), (misure['y2_strum_C']-misure['y2_master_C']), (misure['y3_strum_C']-misure['y3_master_C'])
                    misure['avg_x_C'] = (mean(delta['delta_C'])).round(2)
                    misure['avg_x_C'] = misure['avg_x_C'].replace(np.nan, 0.0)
                if misure['pt_int_D'][0] != '':
                    delta['delta_D'] = (misure['y1_strum_D']-misure['y1_master_D']), (misure['y2_strum_D']-misure['y2_master_D']), (misure['y3_strum_D']-misure['y3_master_D'])
                    misure['avg_x_D'] = (mean(delta['delta_D'])).round(2)
                    misure['avg_x_D'] = misure['avg_x_D'].replace(np.nan, 0.0)
                if misure['pt_int_E'][0] != '':
                    delta['delta_E'] = (misure['y1_strum_E']-misure['y1_master_E']), (misure['y2_strum_E']-misure['y2_master_E']), (misure['y3_strum_E']-misure['y3_master_E'])
                    misure['avg_x_E'] = (mean(delta['delta_E'])).round(2)
                    misure['avg_x_E'] = misure['avg_x_E'].replace(np.nan, 0.0)
                
                if misure['pt_int_F'][0] != '':
                    delta['delta_F'] = (misure['y1_strum_F']-misure['y1_master_F']), (misure['y2_strum_F']-misure['y2_master_F']), (misure['y3_strum_F']-misure['y3_master_F'])
                    misure['avg_x_F'] = (mean(delta['delta_F'])).round(2)
                    misure['avg_x_F'] = misure['avg_x_F'].replace(np.nan, 0.0)

            if ('%' in str(misure['toll_tecnica_stabilita'])):
                if misure['pt_int_A'][0] != '':
                    delta['delta_A'] = (misure['y1_strum_A']-misure['y1_master_A'])/misure['pt_int_A']*100, (misure['y2_strum_A']-misure['y2_master_A'])/misure['pt_int_A']*100, (misure['y3_strum_A']-misure['y3_master_A'])/misure['pt_int_A']*100
                    misure['avg_x_A'] = (mean(delta['delta_A'])).round(2)
                    misure['avg_x_A'] = misure['avg_x_A'].replace(np.nan, 0.0)
                if misure['pt_int_B'][0] != '':
                    delta['delta_B'] = (misure['y1_strum_B']-misure['y1_master_B'])/misure['pt_int_B']*100, (misure['y2_strum_B']-misure['y2_master_B'])/misure['pt_int_B']*100, (misure['y3_strum_B']-misure['y3_master_B'])/misure['pt_int_B']*100
                    misure['avg_x_B'] = (mean(delta['delta_B'])).round(2)
                    misure['avg_x_B'] = misure['avg_x_B'].replace(np.nan, 0.0)
                if misure['pt_int_C'][0] != '':
                    delta['delta_C'] = (misure['y1_strum_C']-misure['y1_master_C'])/misure['pt_int_C']*100, (misure['y2_strum_C']-misure['y2_master_C'])/misure['pt_int_C']*100, (misure['y3_strum_C']-misure['y3_master_C'])/misure['pt_int_C']*100
                    misure['avg_x_C'] = (mean(delta['delta_C'])).round(2)
                    misure['avg_x_C'] = misure['avg_x_C'].replace(np.nan, 0.0)
                if misure['pt_int_D'][0] != '':
                    delta['delta_D'] = (misure['y1_strum_D']-misure['y1_master_D'])/misure['pt_int_D']*100, (misure['y2_strum_D']-misure['y2_master_D'])/misure['pt_int_D']*100, (misure['y3_strum_D']-misure['y3_master_D'])/misure['pt_int_D']*100
                    misure['avg_x_D'] = (mean(delta['delta_D'])).round(2)
                    misure['avg_x_D'] = misure['avg_x_D'].replace(np.nan, 0.0)
                if misure['pt_int_E'][0] != '':
                    delta['delta_E'] = (misure['y1_strum_E']-misure['y1_master_E'])/misure['pt_int_E']*100, (misure['y2_strum_E']-misure['y2_master_E'])/misure['pt_int_E']*100, (misure['y3_strum_E']-misure['y3_master_E'])/misure['pt_int_E']*100 
                    misure['avg_x_E'] = (mean(delta['delta_E'])).round(2)
                    misure['avg_x_E'] = misure['avg_x_E'].replace(np.nan, 0.0)
                    
                if misure['pt_int_F'][0] != '':
                    delta['delta_F'] = (misure['y1_strum_F']-misure['y1_master_F'])/misure['pt_int_F']*100, (misure['y2_strum_F']-misure['y2_master_F'])/misure['pt_int_F']*100, (misure['y3_strum_F']-misure['y3_master_F'])/misure['pt_int_F']*100 
                    misure['avg_x_F'] = (mean(delta['delta_F'])).round(2)
                    misure['avg_x_F'] = misure['avg_x_F'].replace(np.nan, 0.0)
            
            if 'ang' in str(misure['toll_tecnica_stabilita']):
                if misure['pt_int_A'][0] != '':
                    delta['delta_A'] = (misure['y1_strum_A']-misure['y1_master_A']), (misure['y2_strum_A']-misure['y2_master_A']), (misure['y3_strum_A']-misure['y3_master_A'])
                    misure['avg_x_A'] = mean(delta['delta_A'])
                    misure['avg_x_A'] = (rad2deg(arctan(misure['avg_x_A']/191.9945))-(misure['pt_int_A'])).round(3)
                if misure['pt_int_B'][0] != '':
                    delta['delta_B'] = (misure['y1_strum_B']-misure['y1_master_B']), (misure['y2_strum_B']-misure['y2_master_B']), (misure['y3_strum_B']-misure['y3_master_B'])
                    misure['avg_x_B'] = mean(delta['delta_B'])
                    misure['avg_x_B'] = (rad2deg(arctan(misure['avg_x_B']/191.9945))-(misure['pt_int_B'])).round(3)
                if misure['pt_int_C'][0] != '':
                    delta['delta_C'] = (misure['y1_strum_C']-misure['y1_master_C']), (misure['y2_strum_C']-misure['y2_master_C']), (misure['y3_strum_C']-misure['y3_master_C'])
                    misure['avg_x_C'] = mean(delta['delta_C'])
                    misure['avg_x_C'] = (rad2deg(arctan(misure['avg_x_C']/191.9945))-(misure['pt_int_C'])).round(3)
                if misure['pt_int_D'][0] != '':
                    delta['delta_D'] = (misure['y1_strum_D']-misure['y1_master_D']), (misure['y2_strum_D']-misure['y2_master_D']), (misure['y3_strum_D']-misure['y3_master_D'])
                    misure['avg_x_D'] = mean(delta['delta_D'])
                    misure['avg_x_D'] = (rad2deg(arctan(misure['avg_x_D']/191.9945))-(misure['pt_int_D'])).round(3)
                if misure['pt_int_E'][0] != '':
                    delta['delta_E'] = (misure['y1_strum_E']-misure['y1_master_E']), (misure['y2_strum_E']-misure['y2_master_E']), (misure['y3_strum_E']-misure['y3_master_E'])
                    misure['avg_x_E'] = mean(delta['delta_E'])
                    misure['avg_x_E'] = (rad2deg(arctan(misure['avg_x_E']/191.9945))-(misure['pt_int_E'])).round(3)   

                if misure['pt_int_F'][0] != '':
                    delta['delta_F'] = (misure['y1_strum_F']-misure['y1_master_F']), (misure['y2_strum_F']-misure['y2_master_F']), (misure['y3_strum_F']-misure['y3_master_F'])
                    misure['avg_x_F'] = mean(delta['delta_F'])
                    misure['avg_x_F'] = (rad2deg(arctan(misure['avg_x_F']/191.9945))-(misure['pt_int_F'])).round(3)            

            delta = delta.reset_index(drop=True).astype(float).replace(np.nan, 0.0)
            misure['LSC_x'] = (misure['y_rif']+0.15*misure['T_pre']/sqrt(3)).round(2)
            misure['LIC_x'] = (misure['y_rif']-0.15*misure['T_pre']/sqrt(3)).round(2)

        if(str(misure['scm'][0]) != '98'):
            if misure['pt_int_A'][0] != '':
                misure['range_A'] = delta['delta_A'].max() - delta['delta_A'].min()
                misure['range_A'] = (misure['range_A'].replace(np.nan, 0.0)).round(2)
            if misure['pt_int_B'][0] != '':
                misure['range_B'] = delta['delta_B'].max() - delta['delta_B'].min()
                misure['range_B'] = (misure['range_B'].replace(np.nan, 0.0)).round(2)
            if misure['pt_int_C'][0] != '':
                misure['range_C'] = delta['delta_C'].max() - delta['delta_C'].min()
                misure['range_C'] = (misure['range_C'].replace(np.nan, 0.0)).round(2)
            if misure['pt_int_D'][0] != '':
                misure['range_D'] = delta['delta_D'].max() - delta['delta_D'].min()
                misure['range_D'] = (misure['range_D'].replace(np.nan, 0.0)).round(2)
            if misure['pt_int_E'][0] != '':
                misure['range_E'] = delta['delta_E'].max() - delta['delta_E'].min()
                misure['range_E'] = (misure['range_E'].replace(np.nan, 0.0)).round(2)
            if misure['pt_int_F'][0] != '':
                misure['range_F'] = delta['delta_F'].max() - delta['delta_F'].min()
                misure['range_F'] = (misure['range_F'].replace(np.nan, 0.0)).round(2)

        if(str(misure['scm'][0]) != '11' and str(misure['scm'][0]) != '98'):
            misure['LSC_r'] = (misure['D4']*misure['d2']*0.05*misure['T_pre']).round(2)
            misure['LIC_r'] = (misure['D3']*misure['d2']*0.05*misure['T_pre']).round(2)
            
        if( str(misure['scm'][0]) != '98'):
            if misure['pt_int_F'][0] != '' and flag == 'False':
                flag = 'True'
                if ((misure['LIC_x'][0]<=misure['avg_x_A'][0]) & (misure['avg_x_A'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_B'][0]) & (misure['avg_x_B'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_C'][0]) & (misure['avg_x_C'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_D'][0]) & (misure['avg_x_D'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_E'][0]) & (misure['avg_x_E'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_F'][0]) & (misure['avg_x_F'][0]<=misure['LSC_x'][0])):
                    print("esito_x true")
                    esito_x = 'True'
                if ((misure['LIC_r'][0]<=misure['range_A'][0]) & (misure['range_A'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_B'][0]) & (misure['range_B'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_C'][0]) & (misure['range_C'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_D'][0]) & (misure['range_D'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_E'][0]) & (misure['range_E'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_E'][0]) & (misure['range_E'][0]<=misure['LSC_r'][0])): 
                    print("esito_r true")
                    esito_r = 'True'

            if misure['pt_int_E'][0] != '' and flag == 'False':
                flag = 'True'
                if ((misure['LIC_x'][0]<=misure['avg_x_A'][0]) & (misure['avg_x_A'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_B'][0]) & (misure['avg_x_B'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_C'][0]) & (misure['avg_x_C'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_D'][0]) & (misure['avg_x_D'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_E'][0]) & (misure['avg_x_E'][0]<=misure['LSC_x'][0])):
                    print("esito_x true")
                    esito_x = 'True'
                if ((misure['LIC_r'][0]<=misure['range_A'][0]) & (misure['range_A'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_B'][0]) & (misure['range_B'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_C'][0]) & (misure['range_C'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_D'][0]) & (misure['range_D'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_E'][0]) & (misure['range_E'][0]<=misure['LSC_r'][0])): 
                    print("esito_r true")
                    esito_r = 'True'

            if misure['pt_int_D'][0] != '' and flag == 'False':
                flag = 'True'
                if ((misure['LIC_x'][0]<=misure['avg_x_A'][0]) & (misure['avg_x_A'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_B'][0]) & (misure['avg_x_B'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_C'][0]) & (misure['avg_x_C'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_D'][0]) & (misure['avg_x_D'][0]<=misure['LSC_x'][0])):
                    print("esito_x true")
                    esito_x = 'True'
                if ((misure['LIC_r'][0]<=misure['range_A'][0]) & (misure['range_A'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_B'][0]) & (misure['range_B'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_C'][0]) & (misure['range_C'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_D'][0]) & (misure['range_D'][0]<=misure['LSC_r'][0])): 
                    print("esito_r true")
                    esito_r = 'True'

            if misure['pt_int_C'][0] != '' and flag == 'False':
                flag = 'True'
                if ((misure['LIC_x'][0]<=misure['avg_x_A'][0]) & (misure['avg_x_A'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_B'][0]) & (misure['avg_x_B'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_C'][0]) & (misure['avg_x_C'][0]<=misure['LSC_x'][0])):
                    print("esito_x true")
                    esito_x = 'True'
                if ((misure['LIC_r'][0]<=misure['range_A'][0]) & (misure['range_A'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_B'][0]) & (misure['range_B'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_C'][0]) & (misure['range_C'][0]<=misure['LSC_r'][0])): 
                    print("esito_r true")
                    esito_r = 'True'

            if misure['pt_int_B'][0] != '' and flag == 'False':
                flag = 'True'
                if ((misure['LIC_x'][0]<=misure['avg_x_A'][0]) & (misure['avg_x_A'][0]<=misure['LSC_x'][0])) & ((misure['LIC_x'][0]<=misure['avg_x_B'][0]) & (misure['avg_x_B'][0]<=misure['LSC_x'][0])):
                    print("esito_x true")
                    esito_x = 'True'
                if ((misure['LIC_r'][0]<=misure['range_A'][0]) & (misure['range_A'][0]<=misure['LSC_r'][0]) & (misure['LIC_r'][0]<=misure['range_B'][0]) & (misure['range_B'][0]<=misure['LSC_r'][0])):
                    print("esito_r true")
                    esito_r = 'True'

            if misure['pt_int_A'][0] != ''and flag == 'False':
                flag = 'True'
                if ((misure['LIC_x'][0]<=misure['avg_x_A'][0]) & (misure['avg_x_A'][0]<=misure['LSC_x'][0])):
                    print("esito_x true")
                    esito_x = 'True'
                if ((misure['LIC_r'][0]<=misure['range_A'][0]) & (misure['range_A'][0]<=misure['LSC_r'][0])):
                    print("esito_r true")
                    esito_r = 'True'
        
        if(str(misure['scm'][0]) == '11'):
            flag = 'True'
            if (misure['y_integrita'][0] == 'true' and misure['y_conformita'][0] == 'true'):
                print("esito_x true")
                esito_x = 'True'
                print("esito_r true")
                esito_r = 'True'
                
        if(str(misure['scm'][0]) == '98'):
            flag = 'True'
            if (misure['y_A'][0] == 'true' and misure['y_B'][0] == 'false'):
                print("esito_x true")
                esito_x = 'True'
                print("esito_r true")
                esito_r = 'True'
        
    
        if not misure.empty:
            scm = misure['scm'][0]
            del misure['scm']
            del misure['toll_tecnica_stabilita']
            del misure['toll_tecnica_ripetibilita']
            if misure['pt_int_A'][0] == '':
                del misure['pt_int_A']
            else:
                if not pd.to_numeric(misure['pt_int_A'], errors='coerce').notnull().all():
                    misure['pt_int_A'][0] = None
            if misure['pt_int_B'][0] == '':
                del misure['pt_int_B']
            else:
                if not pd.to_numeric(misure['pt_int_B'], errors='coerce').notnull().all():
                    misure['pt_int_B'][0] = None
            if misure['pt_int_C'][0] == '':
                del misure['pt_int_C']
            if misure['pt_int_D'][0] == '':
                del misure['pt_int_D']
            if misure['pt_int_E'][0] == '':
                del misure['pt_int_E']
            if misure['pt_int_F'][0] == '':
                del misure['pt_int_F']
            if misure['y_rif'][0] == '':
                del misure['y_rif']
            if misure['T_pre'][0] == '':
                del misure['T_pre']
            if (str(esito_x) == 'True' and str(esito_r) == 'True' and misure['confermato'][0] == True):
                if (str(scm) == '0'):
                    query_freq_primari = """
                    SELECT freq_tarat_gg
                    FROM TABELLA_PRIMARI
                    WHERE cod_miq = '{}'
                    """.format(misure['cod_miq'][0])
                    freq_tarat_gg = pd.read_sql(query_freq_primari, engine)

                    new_scadenza = pd.to_datetime((pd.to_datetime(misure['data'][0]) + pd.to_timedelta(freq_tarat_gg['freq_tarat_gg'][0], unit="D")).strftime('%Y-%m-%d'))
                    anno_scadenza = new_scadenza.strftime('%Y')
                    settimana_scadenza = new_scadenza.strftime('%W')
                    
                    with engine.connect() as connection:
                        udpate_data = """UPDATE TABELLA_PRIMARI
                                        SET data_ult_tarat = '{}', data_validazione ='{}', scadenza = '{}', anno_scadenza = '{}', settimana_scadenza = '{}'
                                        WHERE cod_miq = '{}'
                        """.format(misure['data'][0], misure['data_validazione'][0], new_scadenza, anno_scadenza, settimana_scadenza, misure['cod_miq'][0])
                  
                        res = connection.execute(udpate_data)
                        res.close()
                else:
                    query_freq_miq = """
                    SELECT freq_tarat_gg
                    FROM TABELLA_MIQ
                    WHERE cod_miq = '{}'
                    """.format(misure['cod_miq'][0])
                    freq_tarat_gg = pd.read_sql(query_freq_miq, engine)

                    new_scadenza = pd.to_datetime((pd.to_datetime(misure['data'][0]) + pd.to_timedelta(freq_tarat_gg['freq_tarat_gg'][0], unit="D")).strftime('%Y-%m-%d'))
                    
                    anno_scadenza = new_scadenza.strftime('%Y')
                    settimana_scadenza = new_scadenza.strftime('%W')
                    
                    with engine.connect() as connection:
                        udpate_data = """UPDATE TABELLA_MIQ
                                        SET data_ult_tarat = '{}', data_validazione ='{}', scadenza = '{}', anno_scadenza = '{}', settimana_scadenza = '{}'
                                        WHERE cod_miq = '{}'
                        """.format(misure['data'][0], misure['data_validazione'][0], new_scadenza, anno_scadenza, settimana_scadenza, misure['cod_miq'][0])
                        res = connection.execute(udpate_data)
                        res.close()
            print(misure)
            misure.to_sql('SCM_' + str(scm), engine, index=False, if_exists='append')
            print("scrittura su database")
            
            if misure['confermato'][0] == False:
                if (str(scm) == '0'):
                    with engine.connect() as connection:
                        query_da_confermare_primari =  """
                        UPDATE TABELLA_PRIMARI
                        SET da_confermare = True
                        WHERE cod_miq = '{}'
                        """.format(misure['cod_miq'][0])
                        da_confermare = connection.execute(query_da_confermare_primari)
                        da_confermare.close()
                else:
                    with engine.connect() as connection:
                        query_da_confermare_primari =  """
                        UPDATE TABELLA_MIQ
                        SET da_confermare = 1
                        WHERE cod_miq = '{}'
                        """.format(misure['cod_miq'][0])
                        da_confermare = connection.execute(query_da_confermare_primari)
                        da_confermare.close()             
    response_object['esito_x'] = esito_x
    response_object['esito_r'] = esito_r

    return jsonify(response_object)

@app.route('/api/v1/rescueTaratura', methods=['POST'])
def rescueTaratura():
    if request.method == 'POST':
        data = request.get_json()
        scm = data['scm']
        cod_miq = data['cod_miq']
        
        try:
            query_freq_miq = """
                        SELECT freq_tarat_gg
                        FROM TABELLA_MIQ
                        WHERE cod_miq = '{}'
                        """.format(cod_miq)
            df = pd.read_sql(query_freq_miq, engine)
            if not df.empty:
                freq_tarat_gg = df['freq_tarat_gg'][0]
                print(freq_tarat_gg)
        except Exception as e:
            print("errore in rescueTaratura sulla query primari")
        try:
            query_freq_miq = """
                        SELECT freq_tarat_gg
                        FROM TABELLA_PRIMARI
                        WHERE cod_miq = '{}'
                        """.format(cod_miq)
            df = pd.read_sql(query_freq_miq, engine)
            if not df.empty:
                freq_tarat_gg = df['freq_tarat_gg'][0]
                print(freq_tarat_gg)
        except Exception as e:
            print("errore in rescueTaratura sulla query primari")
    
        query = """
        SELECT *
        FROM SCM_{} as scm
        WHERE scm.cod_miq = '{}' and scm.confermato = 0
        """.format(scm, cod_miq)
        rescue_taratura = pd.read_sql(query, engine)
        
        rescue_taratura['freq_tarat_gg'] = freq_tarat_gg        
        print(rescue_taratura)
        
        rescue_taratura_json = rescue_taratura.fillna('').to_dict(orient='records')
        response_object = {'status': 'success'}
        response_object['rescue_taratura'] = rescue_taratura_json

    return jsonify(response_object)

@app.route('/api/v1/confermaMetrologica', methods=['POST'])
def confermaMetrologica():
    if request.method == 'POST':
        data = request.get_json()
        data = pd.DataFrame(data, index=[0])
        
        try:
            query_primari = """SELECT scm, freq_tatat_gg
                    FROM TABELLA_PRIMARI
                    WHERE cod_miq = '{}' 
                """.format(data['cod_miq'][0])
            df = pd.read_sql(query_primari, engine)
            if not df.empty:
                scm = df['scm'][0]
            print(scm)
        except Exception as e:
            print("errore in confermaMetrologica sulla query primari")
            
        try:
            query_miq = """SELECT scm, freq_tarat_gg
                    FROM TABELLA_MIQ
                    WHERE cod_miq = '{}'
                """.format(data['cod_miq'][0])
            df = pd.read_sql(query_miq, engine)
            if not df.empty:
                scm = df['scm'][0]
            print(scm)
        except Exception as e:
            print("errore in confermaMetrologica sulla query miq")
            
        try:
            with engine.connect() as connection:
                udpate_data = """UPDATE SCM_{}
                                SET confermato = 1, data_validazione = '{}'
                                WHERE cod_miq = '{}' and confermato = 0 and CONVERT(date, data) = '{}'
                """.format(scm,  pd.to_datetime(data['data_validazione'][0], errors='coerce').strftime('%Y-%m-%d'), data['cod_miq'][0], pd.to_datetime(data['data'][0], errors='coerce').strftime('%Y-%m-%d'))
                res = connection.execute(udpate_data)
                res.close() 
        except Exception as e:
            print("errore in confermaMetrologica su confermato")  
            
        try:
            data['data'][0] = pd.to_datetime(pd.to_datetime(data['data'][0], errors='coerce').strftime('%Y-%m-%d'))
            data['data_validazione'][0] = pd.to_datetime(pd.to_datetime(data['data_validazione'][0], errors='coerce').strftime('%Y-%m-%d'))
            df['scadenza'] = pd.to_datetime((pd.to_datetime(data['data_validazione'][0]) + pd.to_timedelta(df['freq_tarat_gg'][0], unit="D")).strftime('%Y-%m-%d'))
            df['anno_scadenza'] = df['scadenza'][0].strftime('%Y')
            df['settimana_scadenza'] = df['scadenza'][0].strftime('%W')
            df['freq_tarat_gg'] = str(df['freq_tarat_gg'])

            update = df.copy()
            if not update.empty:
                if update['scm'][0] != '0':
                    with engine.connect() as connection:
                        update = update.applymap(replace_strings)
                        
                        udpate_data = """UPDATE TABELLA_MIQ
                                        SET data_ult_tarat = '{}', data_validazione = '{}', scadenza = '{}', settimana_scadenza = '{}', anno_scadenza = '{}', da_confermare = 0                                            
                                        WHERE cod_miq = '{}'
                                """.format( data['data_validazione'][0], data['data_validazione'][0], update['scadenza'][0], update['settimana_scadenza'][0], update['anno_scadenza'][0], 
                                            data['cod_miq'][0])
                        res = connection.execute(udpate_data)
                        res.close()
                else:
                    with engine.connect() as connection:
                        update = update.applymap(replace_strings)
                        
                        udpate_data = """UPDATE TABELLA_PRIMARI
                                            SET data_ult_tarat = '{}', data_validazione = '{}', scadenza = '{}', settimana_scadenza = '{}', anno_scadenza = '{}', da_confermare = 0                                            
                                            WHERE cod_miq = '{}'
                                """.format( data['data_validazione'][0], data['data_validazione'][0], update['scadenza'][0], update['settimana_scadenza'][0], update['anno_scadenza'][0], 
                                            data['cod_miq'][0])
                        res = connection.execute(udpate_data)
                        res.close()
                response_object = {'statusConfermaMetrologica': 'success'}
        except Exception as e:
            print("errore in confermaMetrologica su da_confermare")         

    return jsonify(response_object)


@app.route('/api/v1/eliminaMetrologica', methods=['POST'])
def eliminaMetrologica():
    if request.method == 'POST':
        data = request.get_json()
        data = pd.DataFrame(data, index=[0])
        
        try:
            query_primari = """SELECT scm, freq_tatat_gg
                    FROM TABELLA_PRIMARI
                    WHERE cod_miq = '{}' 
                """.format(data['cod_miq'][0])
            df = pd.read_sql(query_primari, engine)
            if not df.empty:
                scm = df['scm'][0]
            print(scm)
        except Exception as e:
            print("errore in eliminaMetrologica sulla query primari")
            
        try:
            query_miq = """SELECT scm, freq_tarat_gg
                    FROM TABELLA_MIQ
                    WHERE cod_miq = '{}'
                """.format(data['cod_miq'][0])
            df = pd.read_sql(query_miq, engine)
            if not df.empty:
                scm = df['scm'][0]
            print(scm)
        except Exception as e:
            print("errore in eliminaMetrologica sulla query miq")
            
        try:
            with engine.connect() as connection:
                udpate_data = """UPDATE SCM_{}
                                SET confermato = 0
                                WHERE cod_miq = '{}' and confermato = 0 and CONVERT(date, data) = '{}'
                """.format(scm, data['cod_miq'][0], pd.to_datetime(data['data'][0], errors='coerce').strftime('%Y-%m-%d'))
                res = connection.execute(udpate_data)
                res.close() 
        except Exception as e:
            print("errore in eliminaMetrologica su confermato")  
            
        try:
            update = df.copy()
            if not update.empty:
                if update['scm'][0] != '0':
                    with engine.connect() as connection:
                        update = update.applymap(replace_strings)
                        
                        udpate_data = """UPDATE TABELLA_MIQ
                                        SET da_confermare = 0                                            
                                        WHERE cod_miq = '{}'
                                """.format(data['cod_miq'][0])
                        res = connection.execute(udpate_data)
                        res.close()
                else:
                    with engine.connect() as connection:
                        update = update.applymap(replace_strings)
                        
                        udpate_data = """UPDATE TABELLA_PRIMARI
                                            SET da_confermare = 0                                            
                                            WHERE cod_miq = '{}'
                                """.format(data['cod_miq'][0])
                        res = connection.execute(udpate_data)
                        res.close()
                response_object = {'statusEliminaMetrologica': 'success'}
        except Exception as e:
            print("errore in eliminaMetrologica su da_confermare")         

    return jsonify(response_object)



@app.route('/api/v1/prediction', methods=['POST'])
def prediction():
    response_object = {'statusPrediction': 'success'}
    if request.method == 'POST':
        post_data = request.get_json()
        misure_dict = json.loads(post_data['misure'])
        misure = pd.DataFrame(misure_dict, index=[0])
        print(misure)

        if not misure.empty:
            scm = misure['scm'][0]
            cod_miq = misure['cod_miq'][0]
            if misure['pt_int_D'][0] != '':
                query = """
                SELECT scm.cod_miq, scm.data, scm.LSC_x, scm.LIC_x, scm.LSC_r, scm.LIC_r, 
                scm.pt_int_A, scm.calibrazione_A, scm.val_calib_A, scm.val_calib_master_A, scm.avg_x_A, scm.range_A, 
                scm.pt_int_B, scm.calibrazione_B, scm.val_calib_B, scm.val_calib_master_B, scm.avg_x_B, scm.range_B, 
                scm.pt_int_C, scm.calibrazione_C, scm.val_calib_C, scm.val_calib_master_C, scm.avg_x_C, scm.range_C, 
                scm.pt_int_D, scm.calibrazione_D, scm.val_calib_D, scm.val_calib_master_D, scm.avg_x_D, scm.range_D, scadenza, toll_tecnica_stabilita, per.freq_tarat_gg
                FROM SCM_{} as scm
                LEFT JOIN TABELLA_MIQ as miq ON scm.cod_miq = miq.cod_miq 
                LEFT JOIN PERIODI_DI_TARATURA as per ON miq.freq_tarat_gg = per.freq_tarat_gg
                WHERE scm.cod_miq = '{}' and scm.confermato = 1
                ORDER BY scm.data
                """.format(scm, cod_miq)
                df = pd.read_sql(query, engine)
                print(df)
                out_control = df[['data', 'calibrazione_A', 'calibrazione_B', 'calibrazione_C', 'calibrazione_D']]
            elif misure['pt_int_C'][0] != '':
                query = """
                SELECT scm.cod_miq, scm.data, scm.LSC_x, scm.LIC_x, scm.LSC_r, scm.LIC_r, 
                scm.pt_int_A, scm.calibrazione_A, scm.val_calib_A, scm.val_calib_master_A, scm.avg_x_A, scm.range_A, 
                scm.pt_int_B, scm.calibrazione_B, scm.val_calib_B, scm.val_calib_master_B, scm.avg_x_B, scm.range_B, 
                scm.pt_int_C, scm.calibrazione_C, scm.val_calib_C, scm.val_calib_master_C, scm.avg_x_C, scm.range_C,
                scadenza, toll_tecnica_stabilita, per.freq_tarat_gg
                FROM SCM_{} as scm
                LEFT JOIN TABELLA_MIQ as miq ON scm.cod_miq = miq.cod_miq 
                LEFT JOIN PERIODI_DI_TARATURA as per ON miq.freq_tarat_gg = per.freq_tarat_gg
                WHERE scm.cod_miq = '{}' and scm.confermato = 1
                ORDER BY scm.data
                """.format(scm, cod_miq)
                df = pd.read_sql(query, engine)
                print(df)
                out_control = df[['data', 'calibrazione_A', 'calibrazione_B', 'calibrazione_C']]
            elif misure['pt_int_B'][0] != '':
                query = """
                SELECT scm.cod_miq, scm.data, scm.LSC_x, scm.LIC_x, scm.LSC_r, scm.LIC_r, 
                scm.pt_int_A, scm.calibrazione_A, scm.val_calib_A, scm.val_calib_master_A, scm.avg_x_A, scm.range_A, 
                scm.pt_int_B, scm.calibrazione_B, scm.val_calib_B, scm.val_calib_master_B, scm.avg_x_B, scm.range_B, 
                scadenza, toll_tecnica_stabilita, per.freq_tarat_gg
                FROM SCM_{} as scm
                LEFT JOIN TABELLA_MIQ as miq ON scm.cod_miq = miq.cod_miq 
                LEFT JOIN PERIODI_DI_TARATURA as per ON miq.freq_tarat_gg = per.freq_tarat_gg
                WHERE scm.cod_miq = '{}' and scm.confermato = 1
                ORDER BY scm.data
                """.format(scm, cod_miq)
                df = pd.read_sql(query, engine)
                print(df)
                out_control = df[['data', 'calibrazione_A', 'calibrazione_B']]
            elif misure['pt_int_A'][0] != '':
                query = """
                SELECT scm.cod_miq, scm.data, scm.LSC_x, scm.LIC_x, scm.LSC_r, scm.LIC_r, 
                scm.pt_int_A, scm.calibrazione_A, scm.val_calib_A, scm.val_calib_master_A, scm.avg_x_A, scm.range_A, 
                scadenza, toll_tecnica_stabilita, per.freq_tarat_gg
                FROM SCM_{} as scm
                LEFT JOIN TABELLA_MIQ as miq ON scm.cod_miq = miq.cod_miq 
                LEFT JOIN PERIODI_DI_TARATURA as per ON miq.freq_tarat_gg = per.freq_tarat_gg
                WHERE scm.cod_miq = '{}' and scm.confermato = 1
                ORDER BY scm.data
                """.format(scm, cod_miq)
                df = pd.read_sql(query, engine)
                print(df)
                out_control = df[['data', 'calibrazione_A']]
            if not df.empty:
                scadenza = pd.to_datetime(df['scadenza'][0])
                intervallo_di_taratura = df['freq_tarat_gg'][0]
                print(intervallo_di_taratura)

                query_periodi = """
                    SELECT *
                    FROM PERIODI_DI_TARATURA
                    WHERE freq_tarat_gg IN (
                        SELECT MAX(freq_tarat_gg) 
                        FROM PERIODI_DI_TARATURA
                        WHERE freq_tarat_gg < {} 
                        UNION
                        SELECT MIN(freq_tarat_gg)
                        FROM PERIODI_DI_TARATURA
                        WHERE freq_tarat_gg > {}
                    )
                    ORDER BY freq_tarat_gg
                """.format(intervallo_di_taratura, intervallo_di_taratura)
                periodi = pd.read_sql(query_periodi, engine)
                print(periodi)

                response_object['periodo_prec'] = periodi['intervallo_di_taratura'][0]
                response_object['periodo_succ'] = periodi['intervallo_di_taratura'][1]


                
                # Riempi i valori NaN nelle colonne target con un valore specifico (ad es. 0)
                if misure['pt_int_A'][0] != '':
                    df['val_calib_A'] = df['val_calib_A'].fillna(df['pt_int_A'])            
                    df['val_calib_master_A'] = df['val_calib_master_A'].fillna(df['pt_int_A'])

                if misure['pt_int_B'][0] != '':
                    df['val_calib_B'] = df['val_calib_B'].fillna(df['pt_int_B'])
                    df['val_calib_master_B'] = df['val_calib_master_B'].fillna(df['pt_int_B'])

                if misure['pt_int_C'][0] != '':
                    df['val_calib_C'] = df['val_calib_C'].fillna(df['pt_int_C'])
                    df['val_calib_master_C'] = df['val_calib_master_C'].fillna(df['pt_int_C'])

                if misure['pt_int_D'][0] != '':
                    df['val_calib_D'] = df['val_calib_D'].fillna(df['pt_int_D'])   
                    df['val_calib_master_D'] = df['val_calib_master_D'].fillna(df['pt_int_D'])         
                


                # Converti la colonna 'data' in formato datetime
                df['data'] = pd.to_datetime(df['data'])
                # Ordina il dataframe in base alla data
                df.sort_values(by='data', inplace=True)

                if (str(misure['scm'][0]) != '11' and str(misure['scm'][0]) != '0'):

                    if misure['pt_int_F'][0] != '':
                        colonne_float = [
                        'pt_int_A', 'val_calib_A', 'val_calib_master_A',
                        'pt_int_B', 'val_calib_B', 'val_calib_master_B',  
                        'pt_int_C', 'val_calib_C', 'val_calib_master_C', 
                        'pt_int_D', 'val_calib_D', 'val_calib_master_D',
                        'pt_int_E', 'val_calib_E', 'val_calib_master_E', 
                        'pt_int_F', 'val_calib_F', 'val_calib_master_F']
                                
                    elif misure['pt_int_E'][0] != '':
                        colonne_float = [
                        'pt_int_A', 'val_calib_A', 'val_calib_master_A', 
                        'pt_int_B', 'val_calib_B', 'val_calib_master_B',
                        'pt_int_C', 'val_calib_C', 'val_calib_master_C',
                        'pt_int_D', 'val_calib_D', 'val_calib_master_D',
                        'pt_int_E', 'val_calib_E', 'val_calib_master_E']

                    elif misure['pt_int_D'][0] != '':
                        colonne_float = [
                        'pt_int_A', 'val_calib_A', 'val_calib_master_A',
                        'pt_int_B', 'val_calib_B', 'val_calib_master_B',
                        'pt_int_C', 'val_calib_C', 'val_calib_master_C',
                        'pt_int_D', 'val_calib_D', 'val_calib_master_D']
                                    
                    elif misure['pt_int_C'][0] != '':
                        colonne_float = [
                        'pt_int_A', 'val_calib_A', 'val_calib_master_A',
                        'pt_int_B', 'val_calib_B', 'val_calib_master_B',
                        'pt_int_C', 'val_calib_C', 'val_calib_master_C']

                    elif misure['pt_int_B'][0] != '':
                        colonne_float = [
                        'pt_int_A', 'val_calib_A', 'val_calib_master_A',
                        'pt_int_B', 'val_calib_B', 'val_calib_master_B']

                    elif misure['pt_int_A'][0] != '':
                        colonne_float = [
                        'pt_int_A', 'val_calib_A', 'val_calib_master_A']


                    df[colonne_float] = df[colonne_float].astype(str)
                    df[colonne_float] = df[colonne_float].applymap(lambda x: x.replace(',','.')).replace('None', np.nan)
                    df[colonne_float] = df[colonne_float].astype(float)
                    
                    diff = pd.DataFrame()

                    if ( ('%' not in str(misure['toll_tecnica_stabilita'])) & (  'ang' not in str(df['toll_tecnica_stabilita'])) ):
                        if 'pt_int_A' in df.columns:
                            diff['diff_A'] = (df['val_calib_A'] - df['val_calib_master_A'])
                            diff['diff_A'] = diff['diff_A'].replace(np.nan, 0.0)
                        if 'pt_int_B' in df.columns:
                            diff['diff_B'] = (df['val_calib_B'] - df['val_calib_master_B'])
                            diff['diff_B'] = diff['diff_B'].replace(np.nan, 0.0)
                        if 'pt_int_C' in df.columns:
                            diff['diff_C'] = (df['val_calib_C'] - df['val_calib_master_C'])
                            diff['diff_C'] = diff['diff_C'].replace(np.nan, 0.0)
                        if 'pt_int_D' in df.columns:
                            diff['diff_D'] = (df['val_calib_D'] - df['val_calib_master_D'])
                            diff['diff_D'] = diff['diff_D'].replace(np.nan, 0.0)
                        if 'pt_int_E' in df.columns:
                            diff['diff_E'] = (df['val_calib_E'] - df['val_calib_master_E'])
                            diff['diff_E'] = diff['diff_E'].replace(np.nan, 0.0)
                        if 'pt_int_F' in df.columns:
                            diff['diff_F'] = (df['val_calib_F'] - df['val_calib_master_F'])
                            diff['diff_F'] = diff['diff_F'].replace(np.nan, 0.0)

                    if ('%' in str(misure['toll_tecnica_stabilita'])):
                        if 'pt_int_A' in df.columns:
                            diff['diff_A'] = (df['val_calib_A']-df['val_calib_master_A'])/df['pt_int_A']*100
                            diff['diff_A'] = diff['diff_A'].replace(np.nan, 0.0)
                        if 'pt_int_B' in df.columns:
                            diff['diff_B'] = (df['val_calib_B']-df['val_calib_master_B'])/df['pt_int_B']*100
                            diff['diff_B'] = diff['diff_B'].replace(np.nan, 0.0)
                        if 'pt_int_C' in df.columns:
                            diff['diff_C'] = (df['val_calib_C']-df['val_calib_master_C'])/df['pt_int_C']*100
                            diff['diff_C'] = diff['diff_C'].replace(np.nan, 0.0)
                        if 'pt_int_D' in df.columns:
                            diff['diff_D'] = (df['val_calib_D']-df['val_calib_master_D'])/df['pt_int_D']*100
                            diff['diff_D'] = diff['diff_D'].replace(np.nan, 0.0)
                        if 'pt_int_E' in df.columns:
                            diff['diff_E'] = (df['val_calib_E']-df['val_calib_master_E'])/df['pt_int_E']*100
                            diff['diff_E'] = diff['diff_E'].replace(np.nan, 0.0)                    
                        if 'pt_int_F' in df.columns:
                            diff['diff_F'] = (df['val_calib_F']-df['val_calib_master_F'])/df['pt_int_F']*100
                            diff['diff_F'] = diff['diff_F'].replace(np.nan, 0.0)
                    
                    if 'ang' in str(df['toll_tecnica_stabilita']):
                        if 'pt_int_A' in df.columns:
                            diff['diff_A'] = (df['val_calib_A']-df['val_calib_master_A'])
                            diff['diff_A'] = (rad2deg(arctan(diff['diff_A']/191.9945))-(df['pt_int_A'])).round(3)
                        if 'pt_int_B' in df.columns:
                            diff['diff_B'] = (df['val_calib_B']-df['val_calib_master_B'])
                            diff['diff_B'] = (rad2deg(arctan(diff['diff_B']/191.9945))-(df['pt_int_B'])).round(3)
                        if 'pt_int_C' in df.columns:
                            diff['diff_C'] = (df['val_calib_C']-df['val_calib_master_C'])
                            diff['diff_C'] = (rad2deg(arctan(diff['diff_C']/191.9945))-(df['pt_int_C'])).round(3)
                        if 'pt_int_D' in df.columns:
                            diff['diff_D'] = (df['val_calib_D']-df['val_calib_master_D'])
                            diff['diff_D'] = (rad2deg(arctan(diff['diff_D']/191.9945))-(df['pt_int_D'])).round(3)
                        if 'pt_int_E' in df.columns:
                            diff['diff_E'] = (df['val_calib_E']-df['val_calib_master_E'])
                            diff['diff_E'] = (rad2deg(arctan(diff['diff_E']/191.9945))-(df['pt_int_E'])).round(3)
                        if 'pt_int_F' in df.columns:
                            diff['diff_F'] = (df['val_calib_F']-df['val_calib_master_F'])
                            diff['diff_F'] = (rad2deg(arctan(diff['diff_F']/191.9945))-(df['pt_int_F'])).round(3)      

                    diff = diff.reset_index(drop=True).astype(float).replace(np.nan, 0.0)

                # Prepara le variabili indipendenti (X) e dipendenti (y)
                X = df[['data']]

                # Standardizza le variabili indipendenti
                scaler = StandardScaler()
                X_scaled = scaler.fit_transform(X)

                # Esegui la predizione per nuovi dati (ad es. dati futuri)
                # Assicurati che i dati di test siano in formato datetime
                nuovi_dati = pd.DataFrame({'data': [scadenza]}, index=[0])
                nuovi_dati_scaled = scaler.transform(nuovi_dati)

                if 'pt_int_A' in df.columns:
                    y_A = diff['diff_A']
                    # Crea il modello di regressione lineare per 'val_calib_A'
                    model_A = LinearRegression()
                    model_A.fit(X_scaled, y_A)
                    predizioni_A = model_A.predict(nuovi_dati_scaled)
                    predizioni_A_list = predizioni_A.tolist()  
                    print("Predizione per val_calib_A:", predizioni_A_list)
                    response_object['predizioni_A'] = predizioni_A_list
                if 'pt_int_B' in df.columns:
                    y_B = diff['diff_B']
                    # Crea il modello di regressione lineare per 'val_calib_B'
                    model_B = LinearRegression()
                    model_B.fit(X_scaled, y_B)
                    predizioni_B = model_B.predict(nuovi_dati_scaled)            
                    predizioni_B_list = predizioni_B.tolist()
                    print("Predizione per val_calib_B:", predizioni_B_list)
                    response_object['predizioni_B'] = predizioni_B_list
                if 'pt_int_C' in df.columns:
                    y_C = diff['diff_C']
                    # Crea il modello di regressione lineare per 'val_calib_C'
                    model_C = LinearRegression()
                    model_C.fit(X_scaled, y_C)
                    predizioni_C = model_C.predict(nuovi_dati_scaled)
                    predizioni_C_list = predizioni_C.tolist()
                    print("Predizione per val_calib_C:", predizioni_C_list)
                    response_object['predizioni_C'] = predizioni_C_list
                if 'pt_int_D' in df.columns:
                    y_D = diff['diff_D']
                    # Crea il modello di regressione lineare per 'val_calib_D'
                    model_D = LinearRegression()
                    model_D.fit(X_scaled, y_D)
                    predizioni_D = model_D.predict(nuovi_dati_scaled) 
                    predizioni_D_list = predizioni_D.tolist()
                    response_object['predizioni_D'] = predizioni_D_list
                    print("Predizione per val_calib_D:", predizioni_D_list)
                if 'pt_int_E' in df.columns:
                    y_E = diff['diff_E']
                    # Crea il modello di regressione lineare per 'val_calib_E'
                    model_E = LinearRegression()
                    model_E.fit(X_scaled, y_E)
                    predizioni_E = model_E.predict(nuovi_dati_scaled)
                    predizioni_E_list = predizioni_E.tolist()
                    response_object['predizioni_E'] = predizioni_E_list
                    print("Predizione per val_calib_E:", predizioni_E_list)
                if 'pt_int_F' in df.columns:
                    y_F = diff['diff_F']   
                    # Crea il modello di regressione lineare per 'val_calib_F'
                    model_F = LinearRegression()
                    model_F.fit(X_scaled, y_F)    
                    predizioni_F = model_F.predict(nuovi_dati_scaled)
                    predizioni_F_list = predizioni_F.tolist()
                    print("Predizione per val_calib_F:", predizioni_F_list)
                    response_object['predizioni_F'] = predizioni_F_list


                # Convertire il DataFrame in formato JSON
                out_control_json = out_control.to_dict(orient='records')

                # Aggiungere il JSON all'oggetto di risposta
                response_object['out_control'] = out_control_json
            else: 
                print("nessuna taratura precedente su cui fare ML")
                response_object = {'statusPrediction': 'failed'}
                


    return jsonify(response_object)

@app.route('/api/v1/graph', methods=['POST'])
def graph():
    if request.method == 'POST':
        response_object = {} 
        dati = json.loads(request.data)#['cod_miq']
        cod_miq = dati['cod_miq']
        cod_miq = cod_miq.replace('"','')
        scm = dati['scm']
        
        query_campioni = """SELECT miq.campione_di_riferimento
                        FROM TABELLA_MIQ as miq 
                        WHERE miq.cod_miq = '{}'
                    """.format(cod_miq)
        campione_di_riferimento = pd.read_sql(query_campioni, engine)
        print(campione_di_riferimento)
        
        if not campione_di_riferimento.empty:
            if ('+' in campione_di_riferimento['campione_di_riferimento'][0] and scm != 0):
                    parti = campione_di_riferimento['campione_di_riferimento'][0].split('+')
                    parti_pulite = [parte.strip() for parte in parti]
                    df = pd.DataFrame({f'Parte{i+1}': [parte] for i, parte in enumerate(parti_pulite)})

                    scadenza_campioni = pd.DataFrame()
                    for colonna in df.columns:
                        campione_di_riferimento = df[colonna][0]
                        query_anagrafica_miq = f"""
                            SELECT data_ult_tarat, scadenza
                            FROM dbo.TABELLA_PRIMARI
                            WHERE cod_miq = '{campione_di_riferimento}'
                            """.format(campione_di_riferimento = campione_di_riferimento)
                        anagrafica_campione_miq = pd.read_sql(query_anagrafica_miq, engine)

                        scadenza_campioni = pd.concat([scadenza_campioni, anagrafica_campione_miq])
                    scadenza_campioni = scadenza_campioni.reset_index(drop=True)
                    
                    if not anagrafica_campione_miq.empty:
                        # Conversione delle colonne in formato datetime
                        scadenza_campioni['data_ult_tarat'] = pd.to_datetime(scadenza_campioni['data_ult_tarat'])
                        scadenza_campioni['scadenza'] = pd.to_datetime(scadenza_campioni['scadenza'])

                        # Trova la data più vicina a oggi in 'data_ult_tarat'
                        data_ult_tarat_vicino_oggi = scadenza_campioni.loc[scadenza_campioni['data_ult_tarat'].sub(pd.Timestamp.now()).abs().idxmin()]['data_ult_tarat']
                        data_ult_tarat = data_ult_tarat_vicino_oggi.strftime("%Y-%m-%d %H:%M:%S")

                        # Trova la scadenza più vicina a oggi in 'scadenza'
                        scadenza_vicino_oggi = scadenza_campioni.loc[scadenza_campioni['scadenza'].sub(pd.Timestamp.now()).abs().idxmin()]['scadenza']
                        scadenza = scadenza_vicino_oggi.strftime("%Y-%m-%d %H:%M:%S")
            else:
                campione_di_riferimento = campione_di_riferimento['campione_di_riferimento'][0]
                query_anagrafica_miq = f"""
                            SELECT data_ult_tarat, scadenza
                            FROM dbo.TABELLA_PRIMARI
                            WHERE cod_miq = '{campione_di_riferimento}'
                            """.format(campione_di_riferimento = campione_di_riferimento)
                anagrafica_campione_miq = pd.read_sql(query_anagrafica_miq, engine)   
                        
                if not anagrafica_campione_miq.empty:
                    # Conversione delle colonne in formato datetime
                    anagrafica_campione_miq['data_ult_tarat'] = pd.to_datetime(anagrafica_campione_miq['data_ult_tarat'])
                    anagrafica_campione_miq['scadenza'] = pd.to_datetime(anagrafica_campione_miq['scadenza'])

                    # Trova la data più vicina a oggi in 'data_ult_tarat'
                    data_ult_tarat = anagrafica_campione_miq['data_ult_tarat'].iloc[0].strftime("%Y-%m-%d %H:%M:%S")

                    # Trova la scadenza più vicina a oggi in 'scadenza'
                    scadenza = anagrafica_campione_miq['scadenza'].iloc[0].strftime("%Y-%m-%d %H:%M:%S")

        else:
            data_ult_tarat = '1970-01-01'
            scadenza = '2261-12-31'
            # Conversione delle colonne in formato datetime
            data_ult_tarat = pd.to_datetime(data_ult_tarat)
            scadenza = pd.to_datetime(scadenza)

            # Trova la data più vicina a oggi in 'data_ult_tarat'
            data_ult_tarat = data_ult_tarat.strftime("%Y-%m-%d %H:%M:%S")

            # Trova la scadenza più vicina a oggi in 'scadenza'
            scadenza = scadenza.strftime("%Y-%m-%d %H:%M:%S")
        graph = None        
        if scm == 11:
            query_graph = """SELECT scm.cod_miq, scm.data, scm.y_integrita, scm.y_conformita 
                    FROM SCM_{} as scm
                    LEFT JOIN TABELLA_MIQ as miq ON scm.cod_miq = miq.cod_miq 
                    WHERE scm.cod_miq = '{}' and scm.confermato = 1
                    ORDER BY scm.data
                """.format(scm, cod_miq)
            graph = pd.read_sql(query_graph, engine)
            graph['y_integrita'] = graph['y_integrita'].replace(True, 'Si')
            graph['y_integrita'] = graph['y_integrita'].replace(False, 'No')
            graph['y_conformita'] = graph['y_conformita'].replace(True, 'Si')
            graph['y_conformita'] = graph['y_conformita'].replace(False, 'No')
            print(graph)
            graph_json = graph.fillna('').astype(str).to_dict(orient = 'records')
            response_object = {'status': 'success'}
            response_object['graph_json'] = graph_json
        else:            
            try:
                query_graph = """SELECT scm.cod_miq, scm.data, scm.LSC_x, scm.LIC_x, scm.LSC_r, scm.LIC_r, scm.pt_int_A, scm.calibrazione_A, scm.val_calib_A, scm.val_calib_master_A, scm.avg_x_A, scm.range_A, 
                                prim.data_ult_tarat, prim.scadenza
                        FROM SCM_{} as scm
                        LEFT JOIN TABELLA_MIQ as miq ON scm.cod_miq = miq.cod_miq 
                        LEFT JOIN TABELLA_PRIMARI as prim ON miq.campione_di_riferimento = prim.cod_miq
                        WHERE scm.cod_miq = '{}' and scm.data > '{}' and scm.data < '{}' and scm.confermato = 1
                        ORDER BY scm.data
                    """.format(scm, cod_miq, data_ult_tarat, scadenza)
                graph = pd.read_sql(query_graph, engine)
                print(graph)
                if (graph['pt_int_A'].isnull().all() == False):
                    npt = 1 
            except Exception as e:
                print(f"query 1 fallita")

            try:
                query_graph = """SELECT scm.cod_miq, scm.data, scm.LSC_x, scm.LIC_x, scm.LSC_r, scm.LIC_r, scm.pt_int_A, scm.calibrazione_A, scm.val_calib_A, scm.val_calib_master_A, scm.avg_x_A, scm.range_A, 
                                scm.pt_int_B, scm.calibrazione_B, scm.val_calib_B, scm.val_calib_master_B, scm.avg_x_B, scm.range_B, prim.data_ult_tarat, prim.scadenza
                        FROM SCM_{} as scm
                        LEFT JOIN TABELLA_MIQ as miq ON scm.cod_miq = miq.cod_miq 
                        LEFT JOIN TABELLA_PRIMARI as prim ON miq.campione_di_riferimento = prim.cod_miq
                        WHERE scm.cod_miq = '{}' and scm.data > '{}' and scm.data < '{}' and scm.confermato = 1
                        ORDER BY scm.data
                    """.format(scm, cod_miq, data_ult_tarat, scadenza)
                graph = pd.read_sql(query_graph, engine)
                print(graph)
                if (graph['pt_int_B'].isnull().all() == False):
                    npt = 2
            except Exception as e:
                print(f"query 2 fallita")

            try:
                query_graph = """SELECT scm.cod_miq, scm.data, scm.LSC_x, scm.LIC_x, scm.LSC_r, scm.LIC_r, scm.pt_int_A, scm.calibrazione_A, scm.val_calib_A, scm.val_calib_master_A, scm.avg_x_A, scm.range_A, 
                                scm.pt_int_B, scm.calibrazione_B, scm.val_calib_B, scm.val_calib_master_B, scm.avg_x_B, scm.range_B,
                                scm.pt_int_C, scm.calibrazione_C, scm.val_calib_C, scm.val_calib_master_C, scm.avg_x_C, scm.range_C, prim.data_ult_tarat, prim.scadenza
                        FROM SCM_{} as scm
                        LEFT JOIN TABELLA_MIQ as miq ON scm.cod_miq = miq.cod_miq 
                        LEFT JOIN TABELLA_PRIMARI as prim ON miq.campione_di_riferimento = prim.cod_miq
                        WHERE scm.cod_miq = '{}' and scm.data > '{}' and scm.data < '{}' and scm.confermato = 1
                        ORDER BY scm.data
                    """.format(scm, cod_miq, data_ult_tarat, scadenza)
                graph = pd.read_sql(query_graph, engine)
                print(graph)
                if (graph['pt_int_C'].isnull().all() == False):
                    npt = 3
            except Exception as e:
                print(f"query 3 fallita")

            try:
                query_graph = """SELECT scm.cod_miq, scm.data, scm.LSC_x, scm.LIC_x, scm.LSC_r, scm.LIC_r, scm.pt_int_A, scm.calibrazione_A, scm.val_calib_A, scm.val_calib_master_A, scm.avg_x_A, scm.range_A, 
                                scm.pt_int_B, scm.calibrazione_B, scm.val_calib_B, scm.val_calib_master_B, scm.avg_x_B, scm.range_B,
                                scm.pt_int_C, scm.calibrazione_C, scm.val_calib_C, scm.val_calib_master_C, scm.avg_x_C, scm.range_C, 
                                scm.pt_int_D, scm.calibrazione_D, scm.val_calib_D, scm.val_calib_master_D, scm.avg_x_D, scm.range_D, 
                                prim.data_ult_tarat, prim.scadenza
                        FROM SCM_{} as scm
                        LEFT JOIN TABELLA_MIQ as miq ON scm.cod_miq = miq.cod_miq 
                        LEFT JOIN TABELLA_PRIMARI as prim ON miq.campione_di_riferimento = prim.cod_miq
                        WHERE scm.cod_miq = '{}' and scm.data > '{}' and scm.data < '{}' and scm.confermato = 1
                        ORDER BY scm.data
                    """.format(scm, cod_miq, data_ult_tarat, scadenza)
                graph = pd.read_sql(query_graph, engine)
                print(graph)
                if (graph['pt_int_D'].isnull().all() == False):
                    npt = 4
            except Exception as e:
                print(f"query 4 fallita")

            try:
                query_graph = """SELECT scm.cod_miq, scm.data, scm.LSC_x, scm.LIC_x, scm.LSC_r, scm.LIC_r, scm.pt_int_A, scm.calibrazione_A, scm.val_calib_A, scm.val_calib_master_A, scm.avg_x_A, scm.range_A, 
                                scm.pt_int_B, scm.calibrazione_B, scm.val_calib_B, scm.val_calib_master_B, scm.avg_x_B, scm.range_B,
                                scm.pt_int_C, scm.calibrazione_C, scm.val_calib_C, scm.val_calib_master_C, scm.avg_x_C, scm.range_C, 
                                scm.pt_int_D, scm.calibrazione_D, scm.val_calib_D, scm.val_calib_master_D, scm.avg_x_D, scm.range_D,
                                scm.pt_int_E, scm.calibrazione_E, scm.val_calib_E, scm.val_calib_master_E, scm.avg_x_E, scm.range_E, prim.data_ult_tarat, prim.scadenza
                        FROM SCM_{} as scm
                        LEFT JOIN TABELLA_MIQ as miq ON scm.cod_miq = miq.cod_miq 
                        LEFT JOIN TABELLA_PRIMARI as prim ON miq.campione_di_riferimento = prim.cod_miq
                        WHERE scm.cod_miq = '{}' and scm.data > '{}' and scm.data < '{}' and scm.confermato = 1
                        ORDER BY scm.data
                    """.format(scm, cod_miq, data_ult_tarat, scadenza)
                graph = pd.read_sql(query_graph, engine)
                print(graph)
                if (graph['pt_int_E'].isnull().all() == False):
                    npt = 5
            except Exception as e:
                print(f"query 5 fallita")

            try:
                query_graph = """SELECT scm.cod_miq, scm.data, scm.LSC_x, scm.LIC_x, scm.LSC_r, scm.LIC_r, scm.pt_int_A, scm.calibrazione_A, scm.val_calib_A, scm.val_calib_master_A, scm.avg_x_A, scm.range_A, 
                                scm.pt_int_B, scm.calibrazione_B, scm.val_calib_B, scm.val_calib_master_B, scm.avg_x_B, scm.range_B,
                                scm.pt_int_C, scm.calibrazione_C, scm.val_calib_C, scm.val_calib_master_C, scm.avg_x_C, scm.range_C, 
                                scm.pt_int_D, scm.calibrazione_D, scm.val_calib_D, scm.val_calib_master_D, scm.avg_x_D, scm.range_D,
                                scm.pt_int_E, scm.calibrazione_E, scm.val_calib_E, scm.val_calib_master_E, scm.avg_x_E, scm.range_E,
                                scm.pt_int_F, scm.calibrazione_F, scm.val_calib_F, scm.val_calib_master_F, scm.avg_x_F, scm.range_F, prim.data_ult_tarat, prim.scadenza
                        FROM SCM_{} as scm
                        LEFT JOIN TABELLA_MIQ as miq ON scm.cod_miq = miq.cod_miq 
                        LEFT JOIN TABELLA_PRIMARI as prim ON miq.campione_di_riferimento = prim.cod_miq
                        WHERE scm.cod_miq = '{}' and scm.data > '{}' and scm.data < '{}' and scm.confermato = 1
                        ORDER BY scm.data
                    """.format(scm, cod_miq, data_ult_tarat, scadenza)
                graph = pd.read_sql(query_graph, engine)
                print(graph)
                if (graph['pt_int_F'].isnull().all() == False):
                    npt = 6
            except Exception as e:
                print(f"query 6 fallita")


            if graph is not None and not graph.empty:
                for i in graph.index:
                    try:
                        if (graph['calibrazione_A'][i] and graph['calibrazione_A'][i] ==  'true'):
                            graph['final_cal_A'] = graph['val_calib_A'] - graph['val_calib_master_A']
                            graph['final_cal_A'] = graph['final_cal_A'].replace(np.nan, graph['val_calib_A'][i])
                    except Exception as e:
                        print("str{e}")
                    try:            
                        if (graph['calibrazione_B'][i] and graph['calibrazione_B'][i] == 'true'):
                            graph['final_cal_B'] = graph['val_calib_B'] - graph['val_calib_master_B']
                            graph['final_cal_B'] = graph['final_cal_B'].replace(np.nan, graph['val_calib_B'][i])
                    except Exception as e:
                        print("str{e}")
                    try:
                        if (graph['calibrazione_C'][i] and graph['calibrazione_C'][i] == 'true'):
                            graph['final_cal_C'] = graph['val_calib_C'] - graph['val_calib_master_C']
                            graph['final_cal_C'] = graph['final_cal_C'].replace(np.nan, graph['val_calib_C'][i])
                    except Exception as e:
                        print("str{e}")
                    try:
                        if (graph['calibrazione_D'][i] and graph['calibrazione_D'][i] == 'true'):
                            graph['final_cal_D'] = graph['val_calib_D'] - graph['val_calib_master_D']
                            graph['final_cal_D'] = graph['final_cal_D'].replace(np.nan, graph['val_calib_D'][i])
                    except Exception as e:
                        print("str{e}")
                    try:
                        if (graph['calibrazione_E'][i] and graph['calibrazione_E'][i] == 'true'):
                            graph['final_cal_E'] = graph['val_calib_E'] - graph['val_calib_master_E']
                            graph['final_cal_E'] = graph['final_cal_E'].replace(np.nan, graph['val_calib_E'][i])
                    except Exception as e:
                        print("str{e}")
                    try:
                        if (graph['calibrazione_F'][i] and graph['calibrazione_F'][i] == 'true'):
                            graph['final_cal_F'] = graph['val_calib_F'] - graph['val_calib_master_F']
                            graph['final_cal_F'] = graph['final_cal_F'].replace(np.nan, graph['val_calib_F'][i])
                    except Exception as e:
                        print("str{e}")
                graph = graph.applymap(round_numbers)
                print(graph)
                graph_json = graph.fillna('').astype(str).to_dict(orient = 'records')
                response_object = {'status': 'success'}
                response_object['graph_json'] = graph_json
                response_object['npt'] = npt

            else:
                response_object = {'status': 'failed'} 
                response_object['graph_json'] = {'status': 'failed'}

        return jsonify(response_object)
    
def round_numbers(value):
    if isinstance(value, (int, float)):
        return round(float(value), 3)
    return value



# @app.route("/api/v1/storeDataOnS3", methods=['POST'])
# @cross_origin()
# def uploadFileOnS3Bucket():
#     if request.method == 'POST':
#         file = json.dumps(request.get_json())
#         fileName = request.json["name"]+"_"+request.json["surname"]+".json"
#         s3_write_file(file, "mydir/subfolderdir", fileName)
#         return Response(json.dumps({'success':True}),  mimetype='application/json')


# @app.route("/api/v1/readfileS3", methods=['GET'])
# @cross_origin()
# def readingDataOnS3Bucket():
#     fileName = request.args.get("fileName", default = 'mysample.json', type = str)
#     json_text= s3_read_file("mydir/subfolderdir", fileName)
#     json_text_f = json_text.decode("utf-8")
#     json_text = json.loads(json_text_f)
#     return Response(json_text,  mimetype='application/json')

# @app.route("/api/v1/readParquetFromS3", methods=['GET'])
# @cross_origin()
# def readParquetFromS3():
#     fileName = request.args.get("fileName", default = 'mysample.parquet', type = str)
#     df = read_parquet_as_df("mydir/subfolderdir", fileName)
#     print(df)
#     response_json = df.to_json(orient='records')
#     return Response(response_json,  mimetype='application/json')

# @app.get("/api/v1/listdir")
# def getListDir():
#     return Response(json.dumps(s3_list_dir("mydir/subfolderdir"), default=str),  mimetype='application/json')

# @app.get("/api/v1/listS3Buckets")
# def getBucketsList():
    
#     bucket_list = []
#     s3 = list_buckets()
#     for bucket in s3:
#         bucket_list.append(bucket.name)
    
#     response_json = {
#         "buckets":bucket_list
#     }
#     return Response(json.dumps(response_json),  mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)
