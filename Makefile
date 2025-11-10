# Constants
POCKETBASE_SERVICE = pocketbase
POCKETBASE_PORT = 8090
POCKETBASE_HEALTH_URL = http://localhost:$(POCKETBASE_PORT)/api/health
POCKETBASE_ADMIN_URL = http://localhost:$(POCKETBASE_PORT)/_/
HEALTH_CHECK_TIMEOUT = 60
ADMIN_EMAIL = super@specialklasen.com
ADMIN_PASSWORD = password
MIGRATIONS_DIR = migrations

.PHONY: start stop snapshot help

# Start the development environment
start:
	@echo "Starting docker compose..."
	docker compose up -d
	@echo "Waiting for PocketBase to be healthy..."
	@timeout=$(HEALTH_CHECK_TIMEOUT); \
	while [ $$timeout -gt 0 ]; do \
		if docker compose exec -T $(POCKETBASE_SERVICE) wget --no-verbose --tries=1 --spider $(POCKETBASE_HEALTH_URL) 2>/dev/null; then \
			echo "PocketBase is ready!"; \
			break; \
		fi; \
		timeout=$$((timeout - 1)); \
		sleep 1; \
	done; \
	if [ $$timeout -eq 0 ]; then \
		echo "ERROR: PocketBase failed to become healthy"; \
		exit 1; \
	fi
	@echo "Ensuring admin user ($(ADMIN_EMAIL) / $(ADMIN_PASSWORD)) exists..."
	@if docker compose exec -T $(POCKETBASE_SERVICE) pocketbase superuser create $(ADMIN_EMAIL) $(ADMIN_PASSWORD) 2>&1 | grep -q "Value must be unique"; then \
		echo "✓ Admin user already exists, skipping creation"; \
	else \
		echo "✓ Admin user created successfully"; \
	fi
	@echo ""
	@echo "✓ Development environment is ready!"
	@echo "  - PocketBase admin: $(POCKETBASE_ADMIN_URL)"
	@echo ""
	@echo "Installing dependencies and starting React dev server..."
	pnpm install
	pnpm dev

# Stop the development environment
stop:
	@echo "Stopping docker compose..."
	docker compose down
	@echo "✓ Development environment stopped."


# Create a snapshot of the current PocketBase collections schema
snapshot:
	@echo "Creating snapshot of current PocketBase collections schema..."
	rm $(MIGRATIONS_DIR)/*_collections_snapshot.js
	docker compose exec $(POCKETBASE_SERVICE) pocketbase migrate collections

# Display available commands
help:
	@echo "Available commands:"
	@echo "  make start    - Start the development environment (Docker + React dev server)"
	@echo "  make stop     - Stop the development environment"
	@echo "  make snapshot - Create a snapshot of PocketBase collections schema"
	@echo "  make help     - Display this help message"