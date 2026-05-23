# Build from repo root: docker build -f server/Dockerfile .
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY server/package.json ./server/
RUN npm ci --workspace=server
COPY server/tsconfig.json ./server/
COPY server/src ./server/src
RUN npm run build --workspace=server

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY server/package.json ./server/
RUN npm ci --workspace=server --omit=dev
COPY --from=builder /app/server/dist ./server/dist
EXPOSE 4000
CMD ["node", "server/dist/index.js"]
