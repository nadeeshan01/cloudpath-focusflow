data "tls_certificate" "github_actions" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github_actions" {
  count = var.enable_github_oidc ? 1 : 0

  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  thumbprint_list = [
    data.tls_certificate.github_actions.certificates[0].sha1_fingerprint
  ]
}

//Create the trust policy

data "aws_iam_policy_document" "github_actions_assume_role" {
  count = var.enable_github_oidc ? 1 : 0

  statement {
    sid    = "AllowGitHubActions"
    effect = "Allow"

    actions = [
      "sts:AssumeRoleWithWebIdentity"
    ]

    principals {
      type = "Federated"

      identifiers = [
        aws_iam_openid_connect_provider.github_actions[0].arn
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"

      values = [
        "sts.amazonaws.com"
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"

      values = [
        "repo:${var.github_repository}:ref:refs/heads/${var.github_branch}"
      ]
    }
  }
}

//Create the IAM Role for GitHub Actions

resource "aws_iam_role" "github_actions_ecr" {
  count = var.enable_github_oidc ? 1 : 0

  name = "${var.project_name}-${var.environment}-github-ecr"

  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role[0].json

  description = "Allows CloudPath FocusFlow GitHub Actions to access its ECR repository"

  max_session_duration = 3600
}

data "aws_iam_policy_document" "github_actions_ecr" {
  count = var.enable_github_oidc ? 1 : 0

  statement {
    sid    = "EcrAuthorization"
    effect = "Allow"

    actions = [
      "ecr:GetAuthorizationToken"
    ]

    resources = ["*"]
  }

  statement {
    sid    = "EcrRepositoryAccess"
    effect = "Allow"

    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:CompleteLayerUpload",
      "ecr:GetDownloadUrlForLayer",
      "ecr:InitiateLayerUpload",
      "ecr:PutImage",
      "ecr:UploadLayerPart"
    ]

    resources = [
      module.ecr.repository_arn
    ]
  }
}

resource "aws_iam_role_policy" "github_actions_ecr" {
  count = var.enable_github_oidc ? 1 : 0

  name = "${var.project_name}-${var.environment}-ecr-policy"
  role = aws_iam_role.github_actions_ecr[0].id

  policy = data.aws_iam_policy_document.github_actions_ecr[0].json
}