terraform {
  backend "gcs" {
    bucket = "samuelko123-woolworths-price-tracker-terraform-state"
    prefix = "terraform/state"
  }
}

provider "aws" {
  region = "ap-southeast-2" # Sydney, Australia
}
