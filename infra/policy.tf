resource "aws_iam_policy" "allow_scheduler_creation" {
  name = "AllowSchedulerCreation"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["scheduler:CreateSchedule"],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "allow_lambda_invoke" {
  name = "AllowLambdaInvoke"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = "lambda:InvokeFunction",
      Resource = "*"
    }]
  })
}

resource "aws_iam_policy" "allow_passrole_policy" {
  name = "AllowPassRole"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "iam:PassRole",
        Resource = "*"
      }
    ]
  })
}
