"""
Include here queries or query templates to be imported elsewhere
"""
QUERY_1 = """
    select *
    from {pcs_schema}.trc_basic_table
    where trc_timestamp between {start_date} and {end_date}
    limit 10
"""

QUERY_2 = """
    select *
    from {multiman_schema}.mm_results
    where data_ora >= {start_date}
    limit 10
"""
