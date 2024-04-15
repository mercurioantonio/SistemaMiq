import os

# For authentication you can use LDAP or SSO. 
# For LDAP use only AUTHENTICATION_SERVER
AUTHENTICATION_SERVER = '' #os.environ['AUTHENTICATION_SERVER']
# For SSO use this following 3 variables
SSO_TENANT_ID = '' #os.environ['SSO_TENANT_ID']
SSO_CLIENT_ID = '' #os.environ['SSO_CLIENT_ID']

# AWS
# AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
# AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
# S3_BUCKET = os.environ['S3_BUCKET']
# AWS_REGION = "eu-west-1"
# AWS_ENDPOINT = os.environ.get('AWS_ENDPOINT')

# RDS
# RDS_HOST = os.environ["RDS_HOST"]
# RDS_PORT = os.environ["RDS_PORT"]
# RDS_USER = os.environ["RDS_USER"]
# RDS_PWD = os.environ["RDS_PWD"]
# RDS_DB = os.environ["RDS_DB"]