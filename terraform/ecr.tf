module "ecr" {
  source = "./modules/ecr"

  repository_name      = "${var.project_name}-${var.environment}"
  image_tag_mutability = "IMMUTABLE"
}