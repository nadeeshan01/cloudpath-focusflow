variable "repository_name" {
  description = "Name of the Amazon ECR repository"
  type        = string

  validation {
    condition     = length(trimspace(var.repository_name)) > 0
    error_message = "repository_name cannot be empty."
  }
}

variable "image_tag_mutability" {
  description = "Controls whether ECR image tags can be overwritten"
  type        = string
  default     = "IMMUTABLE"

  validation {
    condition = contains(
      ["MUTABLE", "IMMUTABLE"],
      var.image_tag_mutability
    )

    error_message = "image_tag_mutability must be MUTABLE or IMMUTABLE."
  }
}