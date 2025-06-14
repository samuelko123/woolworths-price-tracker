resource "aws_sqs_queue" "dlq" {
  name = var.dlq_name
}

resource "aws_iam_policy" "send_message_policy" {
  name = "${var.dlq_name}-send-message-policy"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "SQS:SendMessage",
        Resource = aws_sqs_queue.dlq.arn
      }
    ]
  })
}

resource "aws_sns_topic" "alert_topic" {
  name = "${var.dlq_name}-topic"
}

resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.alert_topic.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

resource "aws_sns_topic_policy" "topic_policy" {
  arn = aws_sns_topic.alert_topic.arn

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "AllowSubscribeFromAdminUser",
        Effect = "Allow",
        Principal = {
          AWS = var.aws_admin_user_arn
        },
        Action = [
          "SNS:Subscribe",
        ],
        Resource = aws_sns_topic.alert_topic.arn
      },
      {
        Sid    = "AllowPublishFromCloudWatch",
        Effect = "Allow",
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        },
        Action   = "SNS:Publish",
        Resource = aws_sns_topic.alert_topic.arn
      }
    ]
  })
}

resource "aws_cloudwatch_metric_alarm" "dlq_alarm" {
  alarm_name        = "${var.dlq_name}-alarm"
  alarm_description = "Triggers if there is a message in the ${var.dlq_name} DLQ"
  alarm_actions     = [aws_sns_topic.alert_topic.arn]

  namespace   = "AWS/SQS"
  metric_name = "ApproximateNumberOfMessagesVisible"

  evaluation_periods  = 1
  period              = 300
  statistic           = "Sum"
  comparison_operator = "GreaterThanThreshold"
  threshold           = 0

  dimensions = {
    QueueName = aws_sqs_queue.dlq.name
  }
}
