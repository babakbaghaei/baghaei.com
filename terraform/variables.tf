# terraform/variables.tf - Variables for the Terraform configuration

variable "db_user" {
  description = "Database user for PostgreSQL"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database password for PostgreSQL"
  type        = string
  sensitive   = true
  default     = "postgres"
}

variable "db_name" {
  description = "Database name for the application"
  type        = string
  default     = "baghaei_db"
}

variable "rabbitmq_user" {
  description = "RabbitMQ user"
  type        = string
  default     = "user"
}

variable "rabbitmq_pass" {
  description = "RabbitMQ password"
  type        = string
  sensitive   = true
  default     = "password"
}

variable "grafana_password" {
  description = "Grafana admin password"
  type        = string
  sensitive   = true
  default     = "admin"
}

variable "jwt_secret" {
  description = "JWT secret for authentication"
  type        = string
  sensitive   = true
  default     = "your-super-secret-jwt-key"
}

variable "keycloak_url" {
  description = "Keycloak server URL"
  type        = string
  default     = "http://localhost:8080"
}

variable "keycloak_realm" {
  description = "Keycloak realm"
  type        = string
  default     = "master"
}

variable "keycloak_client_id" {
  description = "Keycloak client ID"
  type        = string
  default     = "nestjs-app"
}

variable "keycloak_client_secret" {
  description = "Keycloak client secret"
  type        = string
  sensitive   = true
  default     = ""
}