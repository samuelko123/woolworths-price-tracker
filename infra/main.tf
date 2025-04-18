resource "aws_iam_role" "woolworths_price_fetcher_role" {
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "woolworths_price_fetcher_role_policy_attachment" {
  role       = aws_iam_role.woolworths_price_fetcher_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "woolworths_price_fetcher" {
  filename         = "${path.module}/../dist/woolworths_price_fetcher.zip"
  function_name    = "woolworths_price_fetcher"
  role             = aws_iam_role.woolworths_price_fetcher_role.arn
  handler          = "woolworths_price_fetcher.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("${path.module}/../src/lambdas/woolworths_price_fetcher.ts")

  logging_config {
    log_format = "JSON"
  }
}

resource "aws_iam_role" "eventbridge_scheduler_invoke_woolworths_price_fetcher_role" {
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "scheduler.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eventbridge_scheduler_invoke_woolworths_price_fetcher_role_polixy_attachment" {
  role       = aws_iam_role.eventbridge_scheduler_invoke_woolworths_price_fetcher_role.name
  policy_arn = aws_iam_policy.allow_lambda_invoke.arn
}

resource "aws_iam_role" "woolworths_price_scheduler_role" {
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action    = "sts:AssumeRole",
        Principal = { Service = "lambda.amazonaws.com" },
        Effect    = "Allow",
    }]
  })
}

resource "aws_iam_role_policy_attachment" "woolworths_price_scheduler_role_policy_attachment" {
  role       = aws_iam_role.woolworths_price_scheduler_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "woolworths_price_scheduler_role_policy_attachment_scheduler" {
  role       = aws_iam_role.woolworths_price_scheduler_role.name
  policy_arn = aws_iam_policy.allow_scheduler_creation.arn
}

resource "aws_iam_role_policy_attachment" "woolworths_price_scheduler_role_policy_attachment_passrole" {
  role       = aws_iam_role.woolworths_price_scheduler_role.name
  policy_arn = aws_iam_policy.allow_passrole_policy.arn
}

resource "aws_lambda_function" "woolworths_price_scheduler" {
  filename         = "${path.module}/../dist/woolworths_price_scheduler.zip"
  function_name    = "woolworths_price_scheduler"
  role             = aws_iam_role.woolworths_price_scheduler_role.arn
  handler          = "woolworths_price_scheduler.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("${path.module}/../src/lambdas/woolworths_price_scheduler.ts")

  logging_config {
    log_format = "JSON"
  }

  environment {
    variables = {
      TARGET_LAMBDA_ARN  = aws_lambda_function.woolworths_price_fetcher.arn
      SCHEDULER_ROLE_ARN = aws_iam_role.eventbridge_scheduler_invoke_woolworths_price_fetcher_role.arn
    }
  }
}
