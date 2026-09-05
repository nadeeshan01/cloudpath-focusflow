# CloudPath FocusFlow - Terraform

## Purpose

This configuration defines the low-cost AWS infrastructure foundation
for the CloudPath FocusFlow DevOps internship project.

Week 5 focuses on infrastructure planning and safe AWS foundations.
It does not create an EKS cluster.

## Architecture

GitHub Actions
    |
    | OIDC
    v
AWS IAM OIDC Provider
    |
    v
Restricted IAM Role
    |
    v
Amazon ECR

Terraform also defines:

- CloudWatch Log Group
- ECR lifecycle policy
- Common resource tags

## Terraform Resources

The configuration defines:

- Amazon ECR repository
- ECR lifecycle policy
- ECR scan-on-push configuration
- ECR encryption configuration
- CloudWatch Log Group
- GitHub Actions OIDC provider
- GitHub Actions IAM role
- Least-privilege ECR IAM policy

## Explicitly Excluded

Week 5 does not create:

- Amazon EKS
- NAT Gateway
- Amazon RDS
- Application Load Balancer
- Public EC2 instances

## Prerequisites

- Terraform >= 1.8
- AWS CLI
- AWS account
- AWS Budget configured
- Local AWS authentication
- GitHub repository information

## Configuration

Create your local variable file:

```bash
cp terraform.tfvars.example terraform.tfvars