resource "aws_cloudwatch_log_group" "category_fetching_log_group" {
  name              = "/aws/lambda/category-fetching-lambda"
  retention_in_days = 14
}

resource "aws_iam_role" "category_fetching_lambda_role" {
  name = "category-fetching-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "category_fetching_lambda_basic_execution" {
  role       = aws_iam_role.category_fetching_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "category_fetching_lambda" {
  function_name = "category-fetching-lambda"
  role          = aws_iam_role.category_fetching_lambda_role.arn
  handler       = "category-fetching-lambda.handler"
  runtime       = "nodejs22.x"

  filename         = "${path.module}/../dist/category-fetching-lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/../dist/category-fetching-lambda.js")

  logging_config {
    log_format = "JSON"
    log_group  = aws_cloudwatch_log_group.category_fetching_log_group.name

    application_log_level = "INFO"
    system_log_level      = "WARN"
  }
}

resource "aws_scheduler_schedule" "category_fetching_schedule" {
  name = "category-fetching-schedule"

  schedule_expression          = "cron(0 3 * * ? *)" // everyday at 4am
  schedule_expression_timezone = "Australia/Sydney"

  flexible_time_window {
    mode                      = "FLEXIBLE"
    maximum_window_in_minutes = 60
  }

  target {
    arn      = aws_lambda_function.category_fetching_lambda.arn
    role_arn = aws_iam_role.category_fetching_scheduler_role.arn

    retry_policy {
      # If issue occurs, we should investigate.
      maximum_retry_attempts = 0
    }

    input = jsonencode({
      source = "scheduler.category-fetching-schedule",
    })
  }
}

resource "aws_iam_role" "category_fetching_scheduler_role" {
  name = "category-fetching-scheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "scheduler.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "category_fetching_scheduler_policy" {
  name = "category-fetching-scheduler-policy"
  role = aws_iam_role.category_fetching_scheduler_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "lambda:InvokeFunction",
        Resource = aws_lambda_function.category_fetching_lambda.arn
      }
    ]
  })
}
