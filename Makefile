.PHONY: up down restart logs build test clean ent-up ent-down

# Development
up:
	docker-compose up -d

down:
	docker-compose down

restart: down up

logs:
	docker-compose logs -f

build:
	docker-compose build

# Enterprise Stack
ent-up:
	docker-compose -f docker-compose.enterprise.yml up -d

ent-down:
	docker-compose -f docker-compose.enterprise.yml down

# Testing
test:
	npm run test:all

# Utilities
clean:
	docker-compose down -v
	rm -rf backend/dist frontend/.next
