# Specialklasen

## Development

### Prerequisites

- Docker
- Node.js
- pnpm
- make

### Quick Start

Start the development environment (PocketBase + React dev server):

```bash
make start
```

This will:
- Start PocketBase in Docker
- Wait for PocketBase to be healthy
- Create an admin user (email: `super@specialklasen.com`, password: `password`)
- Install npm dependencies
- Start the Vite development server

Then the application will be accessible at [http://localhost:5173](http://localhost:5173) and the PocketBase admin UI at [http://localhost:5173/_/](http://localhost:5173/_/).

Stop the development environment containers:

```bash
make stop
```

View all available commands:

```bash
make help
```

## Build docker image

```bash
docker build -t specialklasen:latest .
```

## Migrations

Migrations stored in the [migrations](./migrations) folder will be automatically applied on PocketBase startup.

### Creating a new collections snapshot

```bash
make snapshot
```

For more information, see the [PocketBase documentation](https://pocketbase.io/docs/migrations/).
