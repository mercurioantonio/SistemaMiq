import connections.rds as rds
import queries as queries


def process_1(start_date: str, end_date: str):
    query = queries.QUERY_1.format(
        start_date=start_date,
        end_date=end_date
    )

    df = rds.execute_query_to_df(
        query=query
    )

    print(df.head())


def process_2(start_date: str):
    query = queries.QUERY_2.format(
        start_date=start_date,
    )

    df = rds.execute_query_to_df(
        query=query
    )

    print(df.head())
