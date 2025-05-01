resource "aws_sqs_queue" "category_queue" {
  name = "category-queue"
}

resource "aws_iam_policy" "category_queue_send_message_policy" {
  name        = "sqs_policy"
  description = "Allow Lambda to interact with SQS"

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
