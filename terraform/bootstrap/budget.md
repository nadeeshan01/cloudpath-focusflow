# AWS Budget Bootstrap

The AWS cost budget is created before Terraform-managed infrastructure.

Budget:
- Name: cloudpath-focusflow-monthly
- Period: Monthly
- Limit: USD 10
- Actual alerts: 50%, 80%, 100%
- Forecast alert: 100%

The budget is an alerting control and does not guarantee an automatic
shutdown of AWS resources.

EKS, NAT Gateway, RDS, ALB and public EC2 resources are outside the
approved Week 5 scope.