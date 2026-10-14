output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "api_ecr_repository_name" {
  description = "API ECR repository name"
  value       = module.api_ecr.repository_name
}

output "api_ecr_repository_url" {
  description = "API ECR repository URL"
  value       = module.api_ecr.repository_url
}

output "api_ecr_repository_arn" {
  description = "API ECR repository ARN"
  value       = module.api_ecr.repository_arn
}

output "web_ecr_repository_name" {
  description = "Frontend ECR repository name"
  value       = module.web_ecr.repository_name
}

output "web_ecr_repository_url" {
  description = "Frontend ECR repository URL"
  value       = module.web_ecr.repository_url
}

output "web_ecr_repository_arn" {
  description = "Frontend ECR repository ARN"
  value       = module.web_ecr.repository_arn
}

output "cloudwatch_log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.focusflow.name
}

output "github_actions_role_arn" {
  description = "GitHub Actions OIDC role ARN"
  value       = try(aws_iam_role.github_actions_ecr[0].arn, null)
}