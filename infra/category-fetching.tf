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


