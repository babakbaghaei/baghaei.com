# Infrastructure as Code with Terraform

This directory contains Terraform configuration to deploy the baghaei.com application infrastructure.

## Prerequisites

- Terraform v1.0 or higher
- Docker installed and running
- Docker provider for Terraform (kreuzwerker/docker)

## Getting Started

1. Install Terraform from https://www.terraform.io/downloads.html

2. Initialize Terraform:
```bash
terraform init
```

3. Create a `terraform.tfvars` file with your custom variables:
```hcl
db_password = "your_secure_db_password"
rabbitmq_pass = "your_secure_rabbitmq_password"
grafana_password = "your_secure_grafana_password"
jwt_secret = "your_secure_jwt_secret"
# Add other sensitive variables as needed
```

4. Review the execution plan:
```bash
terraform plan
```

5. Deploy the infrastructure:
```bash
terraform apply
```

6. To destroy the infrastructure:
```bash
terraform destroy
```

## Architecture

The infrastructure includes:

- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **RabbitMQ**: Message queuing
- **Kong API Gateway**: API management and security
- **Prometheus & Grafana**: Monitoring and visualization
- **Backend**: NestJS application
- **Frontend**: Next.js application

## Security Considerations

- All sensitive variables are marked as sensitive in Terraform
- Use Terraform state backends with encryption for production
- Store sensitive variables in secure remote backends or environment variables
- Regularly rotate secrets and credentials

## Scaling

For production environments, consider:
- Adding load balancers
- Implementing auto-scaling groups
- Using managed services (RDS, ElastiCache, etc.)
- Implementing proper backup and disaster recovery procedures