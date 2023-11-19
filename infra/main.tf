terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source = "hashicorp/aws"
    }
  }
}


# specify the provider region

provider "aws" {
    profile    = "diet-ban-19"
#     access_key = "AKIA5GDVQNTHBQZVIFPV"
#   secret_key = "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"
  region = "ca-central-1"
}

resource "aws_dynamodb_table" "lotion-30153653" {
  name         = "lotion-30153653"
  billing_mode = "PROVISIONED"

  # up to 8KB read per second (eventually consistent)
  read_capacity = 1

  # up to 1KB per second
  write_capacity = 1

  # we only need a student id to find an item in the table; therefore, we 
  # don't need a sort key here
  hash_key = "email"
  range_key = "noteID"

  # the hash_key data type is string
  attribute {
    name =  "email"
    type =   "S"
  }

    attribute {
    name =  "noteID"
    type =   "S"
  }
  
}






# locals is used to declare constants that can be used within the code

locals{
    # get-notes-function_name = "get-notes"
    # delete-note-function_name = "delete-note"
    # save-notes-function_name = "save-notes"

    handler-name = "main.lambda_handler"
    # get-notes-artifact-name = "get-notes-artifact.zip"
    # save-notes-artifact-name = "save-notes-artifact.zip"
    # delete-note-artifact-name = "delete-note-artifact.zip"


}

resource "aws_iam_role" "get-notes_lambda" {
  name               = "iam-for-lambda-get-notes"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
resource "aws_iam_role" "delete-note_lambda" {
  name               = "iam-for-lambda-delete-note"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
resource "aws_iam_role" "save-notes_lambda" {
  name               = "iam-for-lambda-save-notes"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


#create archive file from main.py
 data "archive_file" "lambda_get-notes"{
    type = "zip"
    # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
    source_file = "../functions/get-notes/main.py"
    output_path = "get-notes-artifact.zip"
 }

  data "archive_file" "lambda_delete-note"{
    type = "zip"
    # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
    source_file = "../functions/delete-note/main.py"
    output_path = "delete-note-artifact.zip"
 }

  data "archive_file" "lambda_save-notes"{
    type = "zip"
    # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
    source_file = "../functions/save-note/main.py"
    output_path = "save-notes-artifact.zip"
 }



# create a lambda function
 resource "aws_lambda_function" "get-notes-30120286"{
    role = aws_iam_role.get-notes_lambda.arn
    function_name = "get-notes"
    handler = local.handler-name
    filename = "get-notes-artifact.zip"
    source_code_hash = data.archive_file.lambda_get-notes.output_base64sha256
    runtime = "python3.9"
 }

# create a lambda function
 resource "aws_lambda_function" "delete-note-30120286"{
    role = aws_iam_role.delete-note_lambda.arn
    function_name = "delete-note"
    handler = local.handler-name
    filename = "delete-note-artifact.zip"
    source_code_hash = data.archive_file.lambda_delete-note.output_base64sha256
    runtime = "python3.9"
 }

  resource "aws_lambda_function" "save-notes-30120286"{
    role = aws_iam_role.save-notes_lambda.arn
    function_name = "save-notes"
    handler = local.handler-name
    filename = "save-notes-artifact.zip"
    source_code_hash = data.archive_file.lambda_save-notes.output_base64sha256
    runtime = "python3.9"
 }

 resource "aws_iam_policy" "logs" {
  name        = "lambda-logging"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query"
      ],
      "Resource": ["arn:aws:logs:*:*:*","${aws_dynamodb_table.lotion-30153653.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

#get
resource "aws_iam_role_policy_attachment" "get-notes-lambda_logs" {
  role       = aws_iam_role.get-notes_lambda.name
  policy_arn = aws_iam_policy.logs.arn
}

#save
resource "aws_iam_role_policy_attachment" "save-notes-lambda_logs" {
  role       = aws_iam_role.save-notes_lambda.name
  policy_arn = aws_iam_policy.logs.arn
}

resource "aws_iam_policy" "logs-save" {
name = "lambda-logging-save-note"
description = "IAM policy for logging from a lambda"

policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
{
  "Action": [
    "logs:CreateLogGroup",
    "logs:CreateLogStream",
    "logs:PutLogEvents",
    "dynamodb:PutItem"
  ],
  "Resource": ["arn:aws:logs:*:*:*","${aws_dynamodb_table.lotion-30153653.arn}"],
  "Effect": "Allow"
    }
  ]
}
EOF
}




#delete

resource "aws_iam_role_policy_attachment" "delete-note-lambda_logs" {
  role       = aws_iam_role.delete-note_lambda.name
  policy_arn = aws_iam_policy.logs.arn
}

resource "aws_lambda_function_url" "get-notes-30120286"{
    function_name = aws_lambda_function.get-notes-30120286.function_name
    authorization_type = "NONE"

    cors{
        allow_credentials = true
        allow_origins = ["*"]
        allow_methods = ["DELETE","POST","GET","PUT"]
        allow_headers = ["*"]
        expose_headers = ["keep-alive","date"]        
    }
}



#delete
resource "aws_lambda_function_url" "delete-note-30120286"{
    function_name = aws_lambda_function.delete-note-30120286.function_name
    authorization_type = "NONE"

    cors{
        allow_credentials = true
        allow_origins = ["*"]
        allow_methods = ["DELETE","POST","GET","PUT"]
        allow_headers = ["*"]
        expose_headers = ["keep-alive","date"]        
    }
}

resource "aws_lambda_function_url" "save-notes-30120286"{
    function_name = aws_lambda_function.save-notes-30120286.function_name
    authorization_type = "NONE"

    cors{
        allow_credentials = true
        allow_origins = ["*"]
        allow_methods = ["DELETE","POST","GET","PUT"]
        allow_headers = ["*"]
        expose_headers = ["keep-alive","date"]        
    }
}


output "get-notes_lambda_url" {
    value = aws_lambda_function_url.get-notes-30120286.function_url
}


output "delete-note_lambda_url" {
    value = aws_lambda_function_url.delete-note-30120286.function_url
}

output "save-notes_lambda_url" {
    value = aws_lambda_function_url.save-notes-30120286.function_url
}




