.PHONY: docker docker-stop docker-logs client-generate

# Generate TypeScript client from FastAPI OpenAPI schema
# Usage: make client-generate [API_DIR=path]
API_DIR ?= ../template-fastapi

client-generate:
	@echo "Generating TypeScript client from $(API_DIR)/openapi.json..."
	@npx @hey-api/openapi-ts -i $(API_DIR)/openapi.json -o ./src/client
	@echo "✓ TypeScript client generated in ./src/client"

docker:
	@grep '^NEXT_PUBLIC_' .env.local > .env.production 2>/dev/null || true
	@docker build -t template-nextjs .
	@docker run -d -p 3000:3000 --name template-nextjs --env-file .env.local template-nextjs
	@rm -f .env.production

docker-stop:
	@docker stop template-nextjs && docker rm template-nextjs

docker-logs:
	@docker logs -f template-nextjs
