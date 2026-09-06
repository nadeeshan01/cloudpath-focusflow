# GitHub Actions to AWS OIDC

## Purpose

GitHub Actions will authenticate to AWS using OpenID Connect instead
of long-lived AWS access keys.

## Authentication Flow

GitHub Actions
    |
    | GitHub OIDC identity token
    v
AWS IAM OIDC Provider
    |
    v
AWS STS
    |
    | temporary credentials
    v
GitHub Actions IAM Role
    |
    v
Project ECR Repository

## Trust Restrictions

The IAM trust policy checks:

- OIDC audience: sts.amazonaws.com
- GitHub repository
- GitHub branch

For the current project, the intended identity is:

```text
repo:OWNER/cloudpath-focusflow:ref:refs/heads/main