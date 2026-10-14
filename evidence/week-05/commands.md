# Week 5 Commands

## Git

```bash
git checkout develop
git pull origin develop
git checkout -b feature/terraform-aws-foundation

## Terraform Formatting
```bash
terraform -chdir=terraform fmt -recursive
terraform -chdir=terraform fmt -check -recursive
```

## Terraform Initialization
```bash
terraform -chdir=terraform init
```

## Terraform Validation
```bash
terraform -chdir=terraform validate
```

## Terraform Providers
```bash
terraform -chdir=terraform providers
```

## State Inspection
```bash
terraform -chdir=terraform state list
```

### Security-check the code
#### Search for dangerous permissions:
```bash
grep -Rni \
  "AdministratorAccess\|iam:\*\|ecr:\*\|Action.*\*" \
  terraform \
  --include='*.tf'
```
## Ideally you shouldn't find broad administrator permissions.

## Search for credentials:
```bash

grep -RniE \
  'AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|aws_access_key|aws_secret_key|BEGIN.*PRIVATE KEY' \
  terraform \
  --exclude='terraform.tfstate' \
  --exclude='terraform.tfstate.backup' \
  --exclude='terraform.tfvars' || true
```
## Plan
```bash

terraform -chdir=terraform plan -out=week5.tfplan
terraform -chdir=terraform show week5.tfplan
```

## Apply
### Apply is intentionally not performed until plan, security and cost
reviews are complete.

```bash

terraform -chdir=terraform apply week5.tfplan
```

## AWS Verification After Approved Apply
```bash
aws ecr describe-repositories \
  --repository-names cloudpath-focusflow-dev \
  --region ap-south-1

aws logs describe-log-groups \
  --log-group-name-prefix /cloudpath \
  --region ap-south-1

aws iam get-role \
  --role-name cloudpath-focusflow-dev-github-ecr
```

