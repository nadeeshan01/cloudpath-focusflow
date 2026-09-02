# AWS Cost Control

## Budget

CloudPath FocusFlow uses an AWS monthly cost budget before cloud
infrastructure is provisioned.

- Budget: cloudpath-focusflow-monthly
- Limit: USD 10/month
- Alerts: 50%, 80%, 100%
- Forecast alert: 100%
- Notification: project owner email

## Week 5 allowed infrastructure

- Amazon ECR
- ECR lifecycle policy
- CloudWatch log group
- IAM GitHub OIDC provider
- Least-privilege IAM role

## Explicitly excluded

Week 5 will not create:

- Amazon EKS
- NAT Gateway
- Amazon RDS
- Application Load Balancer
- Public EC2 instances

These services are excluded to prevent unnecessary cloud costs.

## Cost-management strategy

- Keep ECR image count small.
- Remove unused images.
- Retain CloudWatch logs for only seven days.
- Review AWS Billing regularly.
- Destroy temporary infrastructure when no longer required.
- Review `terraform plan` before every apply.

## Resource tagging

Terraform-managed resources use:

- Project = cloudpath-focusflow
- Environment = dev
- ManagedBy = terraform
- Owner = project owner

Tags provide ownership information and support cost analysis.

## Important limitation

AWS Budgets provides spending alerts. A budget alert alone should not
be treated as a hard spending limit.