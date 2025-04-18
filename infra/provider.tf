terraform {
  backend "s3" {
    bucket         = "woolworths-price-tracker-terraform-state-bucket"
    key            = "woolworths-price-tracker/terraform.tfstate"
    region         = "ap-southeast-2"
    encrypt        = true
  }
}

provider "aws" {
  region = "ap-southeast-2" # Sydney, Australia
}
