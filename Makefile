.PHONY: help docker docker-stop docker-logs client-generate

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*##' Makefile | sed 's/:.*##/ /' | awk '{cmd=$$1; $$1=""; printf "  make %-25s%s\n", cmd, $$0}'

# Generate TypeScript client from FastAPI OpenAPI schema
API_DIR ?= ../template-fastapi

client-generate: ## Generate TypeScript client [API_DIR=path]
	@echo "Generating TypeScript client from $(API_DIR)/openapi.json..."
	@npx @hey-api/openapi-ts -i $(API_DIR)/openapi.json -o ./src/client
	@echo "✓ TypeScript client generated in ./src/client"

docker: ## Build and run Docker container
	@grep '^NEXT_PUBLIC_' .env.local > .env.production 2>/dev/null || true
	@docker build -t template-nextjs .
	@docker run -d -p 3000:3000 --name template-nextjs --env-file .env.local template-nextjs
	@rm -f .env.production

docker-stop: ## Stop and remove Docker container
	@docker stop template-nextjs && docker rm template-nextjs

docker-logs: ## View Docker container logs
	@docker logs -f template-nextjs
