variable "aws_region" {
  description = "AWS region used for CloudPath FocusFlow resources"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project identifier used for resource naming and tagging"
  type        = string
  default     = "cloudpath-focusflow"

  validation {
    condition     = length(var.project_name) >= 3
    error_message = "project_name must contain at least three characters."
  }
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"

  validation {
    condition = contains(
      ["dev", "staging", "prod"],
      var.environment
    )

    error_message = "environment must be dev, staging, or prod."
  }
}

variable "owner" {
  description = "Project owner used for AWS resource tagging"
  type        = string

  validation {
    condition     = length(trimspace(var.owner)) > 0
    error_message = "owner cannot be empty."
  }
}

variable "github_repository" {
  description = "GitHub repository in OWNER/REPOSITORY format"
  type        = string

  validation {
    condition     = can(regex("^[^/]+/[^/]+$", var.github_repository))
    error_message = "github_repository must use OWNER/REPOSITORY format."
  }
}

variable "github_branch" {
  description = "GitHub branch allowed to assume the AWS ECR role"
  type        = string
  default     = "main"
}

variable "enable_github_oidc" {
  description = "Whether Terraform creates GitHub OIDC infrastructure"
  type        = bool
  default     = true
}