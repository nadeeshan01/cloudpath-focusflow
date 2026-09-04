output "aws_region" {
  description = "AWS region used for project infrastructure"
  value       = var.aws_region
}

output "ecr_repository_name" {
  description = "Name of the FocusFlow ECR repository"
  value       = module.ecr.repository_name
}

output "ecr_repository_url" {
  description = "URL of the FocusFlow ECR repository"
  value       = module.ecr.repository_url
}

output "cloudwatch_log_group_name" {
  description = "CloudWatch log group used by FocusFlow"
  value       = aws_cloudwatch_log_group.focusflow.name
}

output "github_actions_role_arn" {
  description = "IAM role assumed by GitHub Actions through OIDC"

  value = var.enable_github_oidc ? aws_iam_role.github_actions_ecr[0].arn : null
}