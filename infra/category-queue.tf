module "category_dlq" {
  source             = "./modules/dlq-with-email-alert"
  dlq_name           = "category-dlq"
  alert_email        = var.dlq_alert_email_address
  aws_admin_user_arn = var.aws_admin_user_arn
}

resource "aws_sqs_queue" "category_queue" {
  name = "category-queue"

  redrive_policy = jsonencode({
    deadLetterTargetArn = module.category_dlq.queue_arn
    maxReceiveCount     = 1
  })

  depends_on = [module.category_dlq]
}

resource "aws_iam_policy" "category_queue_send_message_policy" {
  name = "category_queue_send_message_policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["sqs:SendMessage"]
        Effect   = "Allow"
        Resource = aws_sqs_queue.category_queue.arn
      }
    ]
  })
}

resource "aws_iam_policy" "category_queue_receive_message_policy" {
  name = "category-queue-receive-message-policy"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        Resource = aws_sqs_queue.category_queue.arn
      }
    ]
  })
}

resource "aws_iam_policy" "category_queue_purge_policy" {
  name = "category_queue_purge_policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "sqs:PurgeQueue"
        ]
        Effect   = "Allow"
        Resource = aws_sqs_queue.category_queue.arn
      }
    ]
  })
}

