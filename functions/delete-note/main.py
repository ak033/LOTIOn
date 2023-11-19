import boto3
import json
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("lotion-30153653")

def lambda_handler(event, context):
    email = event["queryStringParameters"]["email"]
    id = event["queryStringParamters"]["id"]

    try:
        table.delete_item(Key ={
            "email":email, 
            "noteID":id,

        })

        return{
            "statusCode":200,
            "body":"success"
        }
    except Exception as exp:
        print(exp)
        return {
            "statusCode":500,
            "body":json.dumps({
                "message": str(exp)

            })


        }
    
