variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "owner" {
  type = string
}

variable "cluster_name" {
  type    = string
  default = "cloudpath-focusflow-final"
}

variable "delete_after" {
  type        = string
  description = "Date by which AWS showcase resources must be destroyed"
}

variable "node_instance_type" {
  type    = string
  default = "t3.small"
}

variable "kubernetes_version" {
  type        = string
  description = "Use a currently supported EKS Kubernetes version"
}