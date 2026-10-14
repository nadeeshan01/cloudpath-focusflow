# AWS Final Week Cost Control

## Time limit

The EKS cluster will run for a maximum of three days.

## Live AWS resources

- Amazon EKS cluster.
- One managed EC2 worker node.
- VPC with two public subnets.
- Internet Gateway.
- ECR repositories.
- CloudWatch logs and optional Container Insights.
- Optional temporary Application Load Balancer.

## Resources excluded from live deployment

- NAT Gateway.
- RDS.
- Multi-AZ database.
- EC2 bastion host.
- Multiple worker nodes.
- Persistent ALB after evidence capture.
- Long-running EKS environment.

## Destruction deadline

All EKS, EC2, ALB, EBS, and related CloudFormation resources must be deleted
after evidence is collected.

## Verification commands

```bash
aws eks list-clusters --region ap-south-1
aws ec2 describe-instances --region ap-south-1
aws ec2 describe-volumes --region ap-south-1
aws elbv2 describe-load-balancers --region ap-south-1
aws ec2 describe-nat-gateways --region ap-south-1
```