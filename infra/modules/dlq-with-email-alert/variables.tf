variable "dlq_name" {
  description = "The name of the DLQ"
  type        = string
}

variable "alert_email" {
  description = "Email address to notify"
  type        = string
}

variable "aws_admin_user_arn" {
  description = "Admin user ARN allowed to subscribe"
  type        = string
}
