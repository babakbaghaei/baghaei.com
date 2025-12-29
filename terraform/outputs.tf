# terraform/outputs.tf - Outputs for the Terraform configuration

output "postgres_host" {
  description = "PostgreSQL host"
  value       = docker_container.postgres.ip_address
}

output "postgres_port" {
  description = "PostgreSQL port"
  value       = docker_container.postgres.ports[0].external
}

output "redis_host" {
  description = "Redis host"
  value       = docker_container.redis.ip_address
}

output "redis_port" {
  description = "Redis port"
  value       = docker_container.redis.ports[0].external
}

output "rabbitmq_host" {
  description = "RabbitMQ host"
  value       = docker_container.rabbitmq.ip_address
}

output "rabbitmq_port" {
  description = "RabbitMQ port"
  value       = docker_container.rabbitmq.ports[0].external
}

output "kong_proxy_port" {
  description = "Kong proxy port"
  value       = docker_container.kong.ports[0].external
}

output "kong_admin_port" {
  description = "Kong admin port"
  value       = docker_container.kong.ports[1].external
}

output "backend_port" {
  description = "Backend API port"
  value       = docker_container.backend.ports[0].external
}

output "frontend_port" {
  description = "Frontend port"
  value       = docker_container.frontend.ports[0].external
}

output "grafana_port" {
  description = "Grafana port"
  value       = docker_container.grafana.ports[0].external
}

output "prometheus_port" {
  description = "Prometheus port"
  value       = docker_container.prometheus.ports[0].external
}