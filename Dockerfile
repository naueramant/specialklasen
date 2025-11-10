# Build frontend
FROM node:25-alpine3.22 AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY . /app
RUN pnpm build

# Download pocketbase
FROM alpine:3.22 AS pocketbase
WORKDIR /pb
ARG PB_VERSION=0.32.0

RUN apk add --no-cache unzip ca-certificates
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Final image
FROM alpine:3.22

EXPOSE 8080

RUN apk add --no-cache ca-certificates

COPY --from=pocketbase /pb/pocketbase /pb/pocketbase
COPY --from=builder /app/dist /pb/pb_public
COPY ./migrations /pb/pb_migrations

# start PocketBase
WORKDIR /pb
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]