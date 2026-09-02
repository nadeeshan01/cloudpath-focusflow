resource "aws_cloudwatch_log_group" "focusflow" {
  name              = "/cloudpath/${var.project_name}/${var.environment}"
  retention_in_days = 7
}