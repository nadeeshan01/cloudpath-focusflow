.PHONY: help build up down logs health scan test clean dev

IMAGE ?= focusflow-api
TAG ?= 0.1.0

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build production Docker image
	docker build --pull -t $(IMAGE):$(TAG) ./app

up: ## Start services with Docker Compose
	docker compose up -d --build

down: ## Stop and remove containers
	docker compose down

logs: ## View container logs
	docker compose logs -f api

health: ## Check health endpoint
	@curl -s http://localhost:5000/health | jq

scan: ## Scan image with Trivy
	trivy image --severity HIGH,CRITICAL --ignore-unfixed $(IMAGE):$(TAG)

test: ## Run tests locally
	cd app && npm test

clean: ## Remove containers, images, and volumes
	docker compose down --rmi local --volumes

dev: ## Start development environment
	docker compose -f compose.dev.yaml up --build

restart: down up ## Restart services

scan-full: ## Full Trivy scan (all severities)
	trivy image $(IMAGE):$(TAG)

scan: ## Scan for HIGH and CRITICAL only
	trivy image --severity HIGH,CRITICAL --ignore-unfixed $(IMAGE):$(TAG)

scan-json: ## Generate JSON scan report
	trivy image --format json -o evidence/week-02/09-trivy-scan.json $(IMAGE):$(TAG)

scan-ci: ## Scan with exit code (for CI)
	trivy image --exit-code 1 --severity CRITICAL,HIGH --ignore-unfixed $(IMAGE):$(TAG)