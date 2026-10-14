# NAT Gateway – Plan Only

> **Status**: Design document only. NAT Gateway resources are **not** provisioned
> in the `eks-demo` module to keep demo costs at zero.

## Why NAT Gateway is excluded

| Concern | Detail |
|---------|--------|
| Cost | ~$32 USD/month per NAT Gateway (fixed hourly rate) |
| Demo scope | Worker nodes use public subnets for egress in this module |
| Course budget | CCA course uses Free-Tier / minimal spend accounts |

## What would need to change

If you were deploying FocusFlow to production with private-subnet worker nodes,
you would add the following resources:

### 1 – Elastic IPs (one per AZ)

```hcl
resource "aws_eip" "nat" {
  count  = length(var.public_subnet_cidrs)
  domain = "vpc"

  tags = {
    Name = "${var.project_name}-${var.environment}-nat-eip-${count.index + 1}"
  }
}
```

### 2 – NAT Gateways (one per AZ for HA)

```hcl
resource "aws_nat_gateway" "eks" {
  count = length(var.public_subnet_cidrs)

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  depends_on = [aws_internet_gateway.eks]

  tags = {
    Name = "${var.project_name}-${var.environment}-nat-${count.index + 1}"
  }
}
```

### 3 – Private Route Table default route

```hcl
resource "aws_route" "private_nat" {
  count = length(var.private_subnet_cidrs)

  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.eks[count.index].id
}
```

> Replace the single `aws_route_table.private` with per-AZ route tables and
> associations when enabling full HA egress.

## Estimated monthly cost (ap-south-1)

| Resource | Rate | Qty | Monthly est. |
|----------|------|-----|-------------|
| NAT Gateway (hourly) | $0.045/hr | 2 | ~$65 |
| NAT data processing | $0.045/GB | varies | variable |
| Elastic IPs (idle) | $0.005/hr | 2 | ~$7 |
| **Total** | | | **~$72+** |

Enable NAT only when promoting to staging or production environments.
