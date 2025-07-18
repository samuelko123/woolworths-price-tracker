resource "aws_dynamodb_table" "product_table" {
  name                        = "products"
  billing_mode                = "PAY_PER_REQUEST"
  deletion_protection_enabled = true

  hash_key = "barcode"

  attribute {
    name = "barcode"
    type = "S"
  }

  attribute {
    name = "sku"
    type = "S"
  }

  global_secondary_index {
    name            = "SkuIndex"
    hash_key        = "sku"
    projection_type = "ALL"
  }
}

resource "aws_iam_policy" "product_table_update_policy" {
  name = "product-table-update-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
        ]
        Resource = aws_dynamodb_table.product_table.arn
      }
    ]
  })
}
