provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "cloudpath-focusflow"
      Environment = "final-aws-demo"
      ManagedBy   = "terraform"
      Owner       = var.owner
      AutoDestroy = "true"
      DeleteAfter = var.delete_after
    }
  }
}