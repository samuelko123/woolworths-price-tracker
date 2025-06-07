resource "aws_sqs_queue" "category_queue" {
  name = "category-queue"
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

