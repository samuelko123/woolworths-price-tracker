output "queue_arn" {
  value = aws_sqs_queue.dlq.arn
}

output "send_message_policy_arn" {
  value = aws_iam_policy.send_message_policy.arn
}
