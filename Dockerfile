# Multi-stage Dockerfile for CivicFix Enterprise Platform
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./

FROM base AS dependencies
RUN npm ci

FROM base AS builder
COPY . .
RUN npm run build --if-present

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app ./

EXPOSE 5000 5173
CMD ["node", "app.js"]
