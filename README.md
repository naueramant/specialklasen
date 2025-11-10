# Specialklasen

## Development

### 1) Install dependencies:

- Docker
- Node.js
- pnpm

### 2) Start PocketBase

```bash
docker compose up -d
```

### 3) Start vite development server

```bash
pnpm install
pnpm dev
```

## Build docker image

```bash
docker build -t specialklasen:latest .
```

## Migrations

Migrations stored in the [migrations](./migrations) folder will be automatically applied on PocketBase startup.

### Creating a new collections snapshot

```bash
docker compose exec pocketbase pocketbase migrate collections
```

For more information, see the [PocketBase documentation](https://pocketbase.io/docs/migrations/).
