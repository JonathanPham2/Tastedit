import boto3
import botocore
import os
import uuid
ALLOWED_EXTENSIONS = {"png","jpg", "jpeg", "gif","webp"}

BUCKET_NAME = os.environ.get("S3_BUCKET")
S3_LOCATION = f"https://{BUCKET_NAME}.s3.amazonaws.com/"

s3 = boto3.client(
    "s3",
    aws_access_key_id = os.environ.get("S3_KEY"),
    aws_secret_access_key = os.environ.get("S3_SECRET")

)
#  get the unique name for each file
def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"

def upload_file_to_s3(file, acl="public-read"):
    try:
        s3.upload_fileobj(
            file, 
            BUCKET_NAME,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }

        )
    except Exception as e:
        return {"errors": str(e)}
    return {"url": f"{S3_LOCATION}{file.filename}"}

def remove_file_from_s3(image_url):
    # AWS needs the image file name not the url
    # so we split that out of the url
    filename = image_url.rsplit("/", 1)[1]
    print(filename)
    try:
        s3.delete_object(
            Bucket=BUCKET_NAME,
            Key=filename
        )
    except Exception as e:
        return {"errors": str(e)}
    return True
    

