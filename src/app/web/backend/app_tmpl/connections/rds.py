import settings as settings
import pandas as pd
import psycopg2
import warnings
warnings.filterwarnings("ignore")

def execute_query(query: str):
    conn = create_rds_connection()
    # Scrittura della tupla nel database RDS
    cur = conn.cursor()
    cur.execute(query)
    conn.commit()
    cur.close()

def execute_query_to_df(query: str, *args, **kwargs) -> pd.DataFrame:
    with create_rds_connection() as connection:
        df = pd.read_sql(
            sql=query,
            con=connection,
            *args,
            **kwargs
        )

    return df


def create_rds_connection() -> psycopg2:
    connection = psycopg2.connect(
        host=settings.RDS_HOST,
        port=settings.RDS_PORT,
        database=settings.RDS_DB,
        user=settings.RDS_USER,
        password=settings.RDS_PWD,
    )

    return connection
