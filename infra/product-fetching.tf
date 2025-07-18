######################################################
# Dead Letter Queue (DLQ)
######################################################

module "product_fetching_dlq" {
  source             = "./modules/dlq-with-email-alert"
  dlq_name           = "product-fetching-dlq"
  alert_email        = var.dlq_alert_email_address
  aws_admin_user_arn = var.aws_admin_user_arn
}

######################################################
# CloudWatch Log Group for Lambda
######################################################

resource "aws_cloudwatch_log_group" "product_fetching_log_group" {
  name              = "/aws/lambda/product-fetching-lambda"
  retention_in_days = 14
}

######################################################
# Lambda Function for Product Fetching
######################################################

resource "aws_iam_role" "product_fetching_lambda_role" {
  name = "product-fetching-lambda-role"

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

resource "aws_iam_role_policy_attachment" "product_fetching_lambda_basic_execution" {
  role       = aws_iam_role.product_fetching_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "product_fetching_lambda_dlq_send_message" {
  role       = aws_iam_role.product_fetching_lambda_role.name
  policy_arn = module.product_fetching_dlq.send_message_policy_arn
}

resource "aws_iam_role_policy_attachment" "product_fetching_lambda_sqs_receive_message" {
  role       = aws_iam_role.product_fetching_lambda_role.name
  policy_arn = aws_iam_policy.category_queue_receive_message_policy.arn
}

resource "aws_iam_role_policy_attachment" "product_fetching_lambda_product_table_write_items" {
  role       = aws_iam_role.product_fetching_lambda_role.name
  policy_arn = aws_iam_policy.product_table_update_policy.arn
}

resource "aws_lambda_function" "product_fetching_lambda" {
  function_name = "product-fetching-lambda"
  role          = aws_iam_role.product_fetching_lambda_role.arn
  handler       = "product-fetching-lambda.handler"
  runtime       = "nodejs22.x"

  filename         = "${path.module}/../dist/product-fetching-lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/../dist/product-fetching-lambda.js")

  timeout = 900 # Timeout in seconds

  environment {
    variables = {
      CATEGORY_QUEUE_URL  = aws_sqs_queue.category_queue.url
      WOOLWORTHS_BASE_URL = "https://www.woolworths.com.au"
    }
  }

  logging_config {
    log_format            = "JSON"
    log_group             = aws_cloudwatch_log_group.product_fetching_log_group.name
    application_log_level = "INFO"
    system_log_level      = "WARN"
  }

  dead_letter_config {
    target_arn = module.product_fetching_dlq.queue_arn
  }

  depends_on = [module.product_fetching_dlq]
}

resource "aws_lambda_function_event_invoke_config" "product_fetching_event_invoke_config" {
  function_name = aws_lambda_function.product_fetching_lambda.function_name

  maximum_retry_attempts       = 0
  maximum_event_age_in_seconds = 60
}

######################################################
# EventBridge Scheduler for Product Lambda
######################################################

resource "aws_scheduler_schedule" "product_fetching_schedule" {
  name = "product-fetching-schedule"

  schedule_expression          = "cron(0/5 4-5 * * ? *)" // every 5 minutes from 4:00 AM to 5:55 AM
  schedule_expression_timezone = "Australia/Sydney"

  flexible_time_window {
    mode                      = "FLEXIBLE"
    maximum_window_in_minutes = 60
  }

  target {
    arn      = aws_lambda_function.product_fetching_lambda.arn
    role_arn = aws_iam_role.product_fetching_schedule_role.arn

    retry_policy {
      maximum_retry_attempts = 0
    }

    input = jsonencode({
      source = "scheduler.product-fetching-schedule",
    })

    dead_letter_config {
      arn = module.product_fetching_dlq.queue_arn
    }
  }

  depends_on = [module.product_fetching_dlq]
}

resource "aws_iam_role" "product_fetching_schedule_role" {
  name = "product-fetching-schedule-role"

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

resource "aws_iam_role_policy" "product_fetching_schedule_policy" {
  name = "product-fetching-schedule-policy"
  role = aws_iam_role.product_fetching_schedule_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "lambda:InvokeFunction",
        Resource = aws_lambda_function.product_fetching_lambda.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "product_fetching_schedule_dlq_send_message" {
  role       = aws_iam_role.product_fetching_schedule_role.name
  policy_arn = module.product_fetching_dlq.send_message_policy_arn
}
