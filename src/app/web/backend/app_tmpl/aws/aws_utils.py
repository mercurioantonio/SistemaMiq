import boto3
from botocore.exceptions import ClientError

import json
import settings as settings
import pickle
import s3fs
import pandas as pd

def list_buckets():
    """
    List S3 buckets.
    """
    s3 = boto3.resource('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, region_name=settings.AWS_REGION, endpoint_url=settings.AWS_ENDPOINT)
    try:
        response = s3.buckets.all()
    except ClientError:
        print('Could not list S3 bucket from LocalStack.')
        raise
    else:
        return response


def s3_write_file(file, directory, filename):
    '''
    Function which a file to S3
    :param file: file to be loaded
    :param directory: Directory (Sub-dir of quality/) to which the file has to be uploaded
    :param filename: Name of the file to load.
    :return:
    '''

    s3 = boto3.resource('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, region_name=settings.AWS_REGION, endpoint_url=settings.AWS_ENDPOINT)
    with open(filename, "w") as fp:
        fp.write(file)
    data = open(filename, 'rb')
    path = '{directory}/{filename}'.format(directory=directory, filename=filename)
    s3.Bucket(settings.S3_BUCKET).put_object(Key=path, Body=data)
    return

def s3_read_file (directory, filename):
    s3 = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, region_name=settings.AWS_REGION, endpoint_url=settings.AWS_ENDPOINT)
    BUCKET = settings.S3_BUCKET
    FILE_TO_READ = "{directory}/{filename}".format(directory = directory, filename = filename)
    result = s3.get_object(Bucket=BUCKET, Key=FILE_TO_READ)
    data = result["Body"].read()
    return data
    
def s3_list_dir (directory):
    s3 = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, region_name=settings.AWS_REGION, endpoint_url=settings.AWS_ENDPOINT)
    response = s3.list_objects_v2(
        Bucket=settings.S3_BUCKET,
        Prefix=directory
    )
    if "Contents" not in response:
        print("value is not present")
        return []   
    else:
        print("value is present")
        return response["Contents"]

def download_file(file_name, bucket, object_name):
    """
    Download a file from a S3 bucket.
    """
    s3 = boto3.resource('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, region_name=settings.AWS_REGION, endpoint_url=settings.AWS_ENDPOINT)
    try:
        response = s3.Bucket(bucket).download_file(object_name, file_name)
    except ClientError:
        print('Could not download file to S3 bucket.')
        raise
    else:
        return response

def create_pickle(directory, final_data,file_name):
    fs = s3fs.S3FileSystem(key = settings.AWS_ACCESS_KEY_ID,  secret=settings.AWS_SECRET_ACCESS_KEY)
    fileUrl = '{bucket}/{directory}/{file_name}'.format(bucket=settings.S3_BUCKET, directory = directory, file_name = file_name) 
    with fs.open(fileUrl, 'wb') as f:
        pickle.dump(final_data,f)
        print('{} saved in s3'.format(final_data))

def read_pickle(directory, file_name):
    fs = s3fs.S3FileSystem(key = settings.AWS_ACCESS_KEY_ID,  secret=settings.AWS_SECRET_ACCESS_KEY)
    fileUrl = '{bucket}/{directory}/{file_name}'.format(bucket=settings.S3_BUCKET, directory = directory, file_name = file_name) 
    with fs.open(fileUrl, 'rb') as f:
        data = pickle.load(f)
    return data

def read_parquet_as_df(directory:str, final_name:str) -> pd.DataFrame:
    FILE_TO_READ = "{bucket}/{directory}/{filename}".format(bucket=settings.S3_BUCKET,directory = directory, filename = final_name)
    s3_fs = s3fs.S3FileSystem(key=settings.AWS_ACCESS_KEY_ID,secret=settings.AWS_SECRET_ACCESS_KEY)
    try:
        with s3_fs.open(FILE_TO_READ, 'rb') as s3_file:
            df = pd.read_parquet(s3_file)
        return df
    except Exception as e:
            print(f"Si è verificato un errore durante la lettura del file Parquet da S3: {e}")
            return None
