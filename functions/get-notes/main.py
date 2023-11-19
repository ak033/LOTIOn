import boto3
from boto3.dynamodb.conditions import Key
import json
import urllib.parse
import urllib.request

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("lotion-30153653")


def lambda_handler(event, context):
    try:
        if "headers" not in event or "authorization" not in event["headers"]:
            return {"statusCode": 400, "body": json.dumps(f"Bad request, {event['headers']}")}

        access_token = event["headers"]["authorization"]
        email = event["queryStringParameters"]["email"]

        validation_url = f'https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}'
        response = urllib.request.urlopen(validation_url)
        token_info = json.loads(response.read())

        if 'error' in token_info:
            return {"statusCode": 401, "body": "Authentication error"}

        if email != token_info.get("email"):
            return {"statusCode": 401, "body": "Unauthorized"}

        res = table.query(KeyConditionExpression=Key("email").eq(email))

        return{
            "statusCode": 200,
            "body": json.dumps(res["Items"])
        }

    except Exception as exp:
        print(exp)
        return{
            "statusCode": 500,
            "body": json.dumps({
                "message": str(exp)
            })
        }