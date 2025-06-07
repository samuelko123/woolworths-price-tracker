######################################################
# Dead Letter Queue (DLQ)
######################################################

resource "aws_sqs_queue" "product_fetching_dlq" {
  name = "product-fetching-dlq"
}

resource "aws_iam_policy" "product_fetching_dlq_send_message_policy" {
  name = "product-fetching-dlq-send-message-policy"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "SQS:SendMessage",
        Resource = aws_sqs_queue.product_fetching_dlq.arn
      }
    ]
  })
}

######################################################
# SNS for DLQ Notifications
######################################################

resource "aws_sns_topic" "product_fetching_dlq_topic" {
  name = "product-fetching-dlq-topic"
}

resource "aws_sns_topic_subscription" "product_fetching_dlq_email_subscription" {
  topic_arn = aws_sns_topic.product_fetching_dlq_topic.arn
  protocol  = "email"
  endpoint  = var.dlq_alert_email_address
}

resource "aws_sns_topic_policy" "product_fetching_dlq_topic_policy" {
  arn = aws_sns_topic.product_fetching_dlq_topic.arn

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "AllowSubscribeFromAdminUser",
        Effect = "Allow",
        Principal = {
          AWS = "${var.aws_admin_user_arn}"
        },
        Action = [
          "SNS:Subscribe",
        ],
        Resource = aws_sns_topic.product_fetching_dlq_topic.arn
      },
      {
        Sid    = "AllowPublishFromCloudWatch",
        Effect = "Allow",
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        },
        Action   = "SNS:Publish",
        Resource = aws_sns_topic.product_fetching_dlq_topic.arn
      }
    ]
  })
}

######################################################
# CloudWatch Alarm for DLQ
######################################################

resource "aws_cloudwatch_metric_alarm" "product_fetching_dlq_alarm" {
  alarm_name        = "product-fetching-dlq-alarm"
  alarm_description = "Triggers if there is a message in the product-fetching DLQ"
  alarm_actions     = [aws_sns_topic.product_fetching_dlq_topic.arn]

  namespace   = "AWS/SQS"
  metric_name = "ApproximateNumberOfMessagesVisible"

  evaluation_periods  = 1
  period              = 300
  statistic           = "Sum"
  comparison_operator = "GreaterThanThreshold"
  threshold           = 0

  dimensions = {
    QueueName = aws_sqs_queue.product_fetching_dlq.name
  }
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
  policy_arn = aws_iam_policy.product_fetching_dlq_send_message_policy.arn
}

resource "aws_iam_role_policy_attachment" "product_fetching_lambda_sqs_receive_message" {
  role       = aws_iam_role.product_fetching_lambda_role.name
  policy_arn = aws_iam_policy.category_queue_receive_message_policy.arn
}

resource "aws_lambda_function" "product_fetching_lambda" {
  function_name = "product-fetching-lambda"
  role          = aws_iam_role.product_fetching_lambda_role.arn
  handler       = "product-fetching-lambda.handler"
  runtime       = "nodejs22.x"

  filename         = "${path.module}/../dist/product-fetching-lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/../dist/product-fetching-lambda.js")

  environment {
    variables = {
      CATEGORY_QUEUE_URL = aws_sqs_queue.category_queue.url
    }
  }

  logging_config {
    log_format = "JSON"
    log_group  = aws_cloudwatch_log_group.product_fetching_log_group.name

    application_log_level = "INFO"
    system_log_level      = "WARN"
  }

  dead_letter_config {
    target_arn = aws_sqs_queue.product_fetching_dlq.arn
  }
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
      arn = aws_sqs_queue.product_fetching_dlq.arn
    }
  }
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
  policy_arn = aws_iam_policy.product_fetching_dlq_send_message_policy.arn
}
