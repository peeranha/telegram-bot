Permissions:

SNS:Subscribe 
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowSubscribe",
            "Effect": "Allow",
            "Action": [
                "sns:Subscribe"
            ],
            "Resource": "arn:aws:sns:us-east-1:939077196930:NEW_QUESTION_WEB"
        }
    ]
}
```