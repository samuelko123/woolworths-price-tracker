output "queue_arn" {
  description = "The ARN of the DLQ queue"
  value       = aws_sqs_queue.dlq.arn
}
