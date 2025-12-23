# terraform/main.tf - Infrastructure as Code for baghaei.com

terraform {
  required_version = ">= 1.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.0"
    }
  }
}

# Configure Docker provider
provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Create network for the application
resource "docker_network" "baghaei_net" {
  name     = "baghaei_net"
  driver   = "bridge"
}

# PostgreSQL container
resource "docker_container" "postgres" {
  name  = "baghaei_postgres"
  image = "postgres:15-alpine"

  env = [
    "POSTGRES_USER=${var.db_user}",
    "POSTGRES_PASSWORD=${var.db_password}",
    "POSTGRES_DB=${var.db_name}"
  ]

  ports {
    internal = 5432
    external = 5432
  }

  volumes {
    volume_name = docker_volume.postgres_data.name
    container_path = "/var/lib/postgresql/data"
  }

  networks_advanced {
    name = docker_network.baghaei_net.name
  }

  healthcheck {
    test         = ["CMD-SHELL", "pg_isready -U ${var.db_user}"]
    interval     = "10s"
    timeout      = "5s"
    retries      = 5
    start_period = "30s"
  }
}

# Redis container
resource "docker_container" "redis" {
  name  = "baghaei_redis"
  image = "redis:alpine"

  ports {
    internal = 6379
    external = 6379
  }

  volumes {
    volume_name = docker_volume.redis_data.name
    container_path = "/data"
  }

  networks_advanced {
    name = docker_network.baghaei_net.name
  }

  depends_on = [docker_container.postgres]
}

# RabbitMQ container
resource "docker_container" "rabbitmq" {
  name  = "baghaei_rabbitmq"
  image = "rabbitmq:3-management-alpine"

  env = [
    "RABBITMQ_DEFAULT_USER=${var.rabbitmq_user}",
    "RABBITMQ_DEFAULT_PASS=${var.rabbitmq_pass}"
  ]

  ports {
    internal = 5672
    external = 5672
  }

  ports {
    internal = 15672
    external = 15672
  }

  networks_advanced {
    name = docker_network.baghaei_net.name
  }

  depends_on = [docker_container.redis]
}

# Kong Database
resource "docker_container" "kong_db" {
  name  = "baghaei_kong_db"
  image = "postgres:15-alpine"

  env = [
    "POSTGRES_USER=kong",
    "POSTGRES_PASSWORD=kong",
    "POSTGRES_DB=kong"
  ]

  volumes {
    volume_name = docker_volume.kong_data.name
    container_path = "/var/lib/postgresql/data"
  }

  networks_advanced {
    name = docker_network.baghaei_net.name
  }

  healthcheck {
    test         = ["CMD", "pg_isready", "-U", "kong"]
    interval     = "30s"
    timeout      = "30s"
    retries      = 3
  }
}

# Kong Migrations
resource "docker_container" "kong_migrations" {
  name  = "baghaei_kong_migrations"
  image = "kong:3.4"
  command = "kong migrations bootstrap"

  env = [
    "KONG_DATABASE=postgres",
    "KONG_PG_HOST=baghaei_kong_db",
    "KONG_PG_USER=kong",
    "KONG_PG_PASSWORD=kong"
  ]

  networks_advanced {
    name = docker_network.baghaei_net.name
  }

  depends_on = [docker_container.kong_db]
}

# Kong Gateway
resource "docker_container" "kong" {
  name  = "baghaei_kong"
  image = "kong:3.4"

  env = [
    "KONG_DATABASE=postgres",
    "KONG_PG_HOST=baghaei_kong_db",
    "KONG_PG_USER=kong",
    "KONG_PG_PASSWORD=kong",
    "KONG_PROXY_ACCESS_LOG=/dev/stdout",
    "KONG_ADMIN_ACCESS_LOG=/dev/stdout",
    "KONG_PROXY_ERROR_LOG=/dev/stderr",
    "KONG_ADMIN_ERROR_LOG=/dev/stderr",
    "KONG_ADMIN_LISTEN=0.0.0.0:8001, 0.0.0.0:8444 ssl"
  ]

  ports {
    internal = 8000
    external = 8000
  }

  ports {
    internal = 8001
    external = 8001
  }

  ports {
    internal = 8443
    external = 8443
  }

  ports {
    internal = 8444
    external = 8444
  }

  networks_advanced {
    name = docker_network.baghaei_net.name
  }

  depends_on = [docker_container.kong_migrations]
}

# Prometheus container
resource "docker_container" "prometheus" {
  name  = "baghaei_prometheus"
  image = "prom/prometheus"

  mounts {
    type = "bind"
    source = "${path.module}/../../infra/prometheus.yml"
    target = "/etc/prometheus/prometheus.yml"
  }

  ports {
    internal = 9090
    external = 9090
  }

  networks_advanced {
    name = docker_network.baghaei_net.name
  }
}

# Grafana container
resource "docker_container" "grafana" {
  name  = "baghaei_grafana"
  image = "grafana/grafana"

  env = [
    "GF_SECURITY_ADMIN_PASSWORD=${var.grafana_password}"
  ]

  ports {
    internal = 3000
    external = 3001
  }

  networks_advanced {
    name = docker_network.baghaei_net.name
  }

  depends_on = [docker_container.prometheus]
}

# Backend container
resource "docker_container" "backend" {
  name  = "baghaei_backend"
  image = "baghaei_backend:latest" # This would be built from your Dockerfile

  env = [
    "DATABASE_URL=postgresql://${var.db_user}:${var.db_password}@baghaei_postgres:5432/${var.db_name}?schema=public",
    "REDIS_HOST=baghaei_redis",
    "REDIS_PORT=6379",
    "RABBITMQ_URL=amqp://${var.rabbitmq_user}:${var.rabbitmq_pass}@baghaei_rabbitmq:5672",
    "JWT_SECRET=${var.jwt_secret}",
    "KEYCLOAK_AUTH_SERVER_URL=${var.keycloak_url}",
    "KEYCLOAK_REALM=${var.keycloak_realm}",
    "KEYCLOAK_CLIENT_ID=${var.keycloak_client_id}",
    "KEYCLOAK_CLIENT_SECRET=${var.keycloak_client_secret}",
    "PORT=3001"
  ]

  ports {
    internal = 3001
    external = 3001
  }

  networks_advanced {
    name = docker_network.baghaei_net.name
  }

  depends_on = [
    docker_container.postgres,
    docker_container.redis,
    docker_container.rabbitmq
  ]
}

# Frontend container
resource "docker_container" "frontend" {
  name  = "baghaei_frontend"
  image = "baghaei_frontend:latest" # This would be built from your Dockerfile

  env = [
    "NEXT_PUBLIC_API_URL=http://localhost:8000" # Changed to go through Kong
  ]

  ports {
    internal = 3000
    external = 3000
  }

  networks_advanced {
    name = docker_network.baghaei_net.name
  }

  depends_on = [docker_container.backend]
}

# Volumes
resource "docker_volume" "postgres_data" {
  name = "baghaei_postgres_data"
}

resource "docker_volume" "redis_data" {
  name = "baghaei_redis_data"
}

resource "docker_volume" "kong_data" {
  name = "baghaei_kong_data"
}