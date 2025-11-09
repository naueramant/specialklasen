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

## Build
```bash
docker build -t specialklasen:latest .
```