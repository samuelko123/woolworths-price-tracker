resource "aws_iam_role" "woolworths_price_fetcher_role" {
  name = "woolworths_price_fetcher-role"
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
  source_code_hash = filebase64sha256("${path.module}/../dist/woolworths_price_fetcher.zip")

  logging_config {
    log_format = "JSON"
  }
}
