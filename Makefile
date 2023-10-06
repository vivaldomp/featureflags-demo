APPLICATION_NAME := 'flag'

.PHONY: help

help:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

all: install build start ## Install golang dependencies, build program and start application

install: ## Install golang dependencies
	go mod download

build: ## Build binary application
	CGO_ENABLED=0 GOOS=linux go build -a -o ${APPLICATION_NAME} .

start: ## Start builded application
	./$(APPLICATION_NAME) publish

stack-up: ## Start containers
	docker-compose up -d --build

stack-down: ## Stop containers
	docker-compose down


