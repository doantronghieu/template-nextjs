.PHONY: docker docker-stop docker-logs

docker:
	@grep '^NEXT_PUBLIC_' .env.local > .env.production 2>/dev/null || true
	@docker build -t template-nextjs .
	@docker run -d -p 3000:3000 --name template-nextjs --env-file .env.local template-nextjs
	@rm -f .env.production

docker-stop:
	@docker stop template-nextjs && docker rm template-nextjs

docker-logs:
	@docker logs -f template-nextjs
