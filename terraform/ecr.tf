module "api_ecr" {
  source = "./modules/ecr"

  repository_name      = "${var.project_name}-api-${var.environment}"
  image_tag_mutability = "IMMUTABLE"
}

module "web_ecr" {
  source = "./modules/ecr"

  repository_name      = "${var.project_name}-web-${var.environment}"
  image_tag_mutability = "IMMUTABLE"
}