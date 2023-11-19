import json
import boto3
import urllib.parse
import urllib.request

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("lotion-30153653")


def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])
        access_token = event["headers"]["authentication"]
        email = event["queryStringParameters"]["email"]

        # Validate token with Google API
        validation_url = f'https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}'
        response = urllib.request.urlopen(validation_url)
        token_info = json.loads(response.read())

        if 'error' in token_info:
            return {"statusCode": 401, "body": "Authentication error"}

        if not body["email"]:
            return {"statusCode": 401, "body": json.dumps("Unauthorized")}

        if email != token_info.get("email"):
            return {"statusCode": 401, "body": "Unauthorized"}

        table.put_item(Item=body)

        return {"statusCode": 200, "body": json.dumps(body)}

    except Exception as exp:
        print(exp)
        return {"statusCode": 500, "body": json.dumps({"message": str(exp)})}