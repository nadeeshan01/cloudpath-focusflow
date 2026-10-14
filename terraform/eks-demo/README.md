# terraform/eks-demo

Terraform configuration that provisions an **Amazon EKS cluster** for the
CloudPath FocusFlow application as part of the CCA DevOps course final week.

## Architecture

```
VPC (10.0.0.0/16)
├── Public Subnets  (10.0.1.0/24, 10.0.2.0/24)  – IGW route
└── Private Subnets (10.0.11.0/24, 10.0.12.0/24) – no NAT (demo)

EKS Control Plane  ← IAM cluster role, Security Group
└── Managed Node Group (t3.medium × 2) ← IAM node role, SG

CloudWatch
├── /aws/eks/<cluster>/cluster  (control plane logs)
└── /cloudpath/focusflow/<env>  (application logs)
```

> NAT Gateway and RDS are **plan-only** in this module. See
> [`nat-plan-only.md`](./nat-plan-only.md) and
> [`rds-plan-only.tf`](./rds-plan-only.tf) for the full design.

## Files

| File | Purpose |
|------|---------|
| `versions.tf` | Terraform & provider version constraints |
| `provider.tf` | AWS provider + default tags |
| `variables.tf` | All input variable declarations |
| `vpc.tf` | VPC, subnets, IGW, route tables |
| `iam.tf` | Cluster role, node role, policy attachments |
| `eks.tf` | EKS cluster + managed node group |
| `security-groups.tf` | Cluster and node security groups |
| `cloudwatch.tf` | Log groups for control plane and application |
| `outputs.tf` | Useful values after `apply` |
| `terraform.tfvars.example` | Variable template (copy → `terraform.tfvars`) |
| `rds-plan-only.tf` | RDS design – `var.create_rds = false` by default |
| `nat-plan-only.md` | NAT Gateway cost analysis and HCL snippets |

## Quick start

```bash
# 1. Copy and fill in your variables
cp terraform.tfvars.example terraform.tfvars
$EDITOR terraform.tfvars

# 2. Initialise providers
terraform init

# 3. Preview changes
terraform plan

# 4. Apply (creates real AWS resources – check costs first!)
terraform apply

# 5. Configure kubectl
$(terraform output -raw kubeconfig_command)
```

## Estimated AWS costs (ap-south-1)

| Resource | Rate | Qty | Monthly est. |
|----------|------|-----|-------------|
| EKS cluster | $0.10/hr | 1 | ~$73 |
| EC2 t3.medium nodes | $0.0416/hr | 2 | ~$60 |
| CloudWatch logs | $0.57/GB ingested | minimal | <$1 |
| **NAT Gateway** | excluded | – | $0 |
| **RDS** | excluded | – | $0 |
| **Total** | | | **~$134/mo** |

> ⚠️ **Destroy after the demo** to avoid ongoing charges:
> `terraform destroy`

## Prerequisites

- Terraform >= 1.8.0
- AWS CLI configured with sufficient IAM permissions
- `kubectl` installed locally
