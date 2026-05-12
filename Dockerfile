# syntax=docker/dockerfile:1

FROM oven/bun:1.3.11-alpine AS deps
WORKDIR /app

COPY package.json bun.lockb ./
ARG NODE_TLS_REJECT_UNAUTHORIZED=0
RUN NODE_TLS_REJECT_UNAUTHORIZED=$NODE_TLS_REJECT_UNAUTHORIZED bun install --frozen-lockfile

FROM oven/bun:1.3.11-alpine AS build
WORKDIR /app

ARG GIT_COMMIT=unknown
ENV GIT_COMMIT=$GIT_COMMIT

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM node:24-bookworm-slim AS runner
WORKDIR /app

ARG GIT_COMMIT=unknown
ENV NODE_ENV=production
ENV PORT=8787
LABEL org.opencontainers.image.revision=$GIT_COMMIT

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./

EXPOSE 8787
CMD ["./node_modules/.bin/wrangler", "dev", "--config", "dist/server/wrangler.json", "--ip", "0.0.0.0", "--port", "8787"]
