# Terraform Runbook

## Standard Workflow

From the repository root:

```bash
terraform -chdir=terraform fmt -recursive
terraform -chdir=terraform init
terraform -chdir=terraform validate
terraform -chdir=terraform plan -out=week5.tfplan
terraform -chdir=terraform show week5.tfplan
