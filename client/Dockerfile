# Build from repo root: docker build -f client/Dockerfile .
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY client/package.json ./client/
RUN npm ci --workspace=client
COPY client/ ./client/
ARG VITE_API_URL=http://localhost:8080
ARG VITE_SOCKET_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
RUN npm run build --workspace=client

FROM nginx:alpine AS runner
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf.template
ARG VITE_API_URL=http://localhost:8080
ARG VITE_SOCKET_URL=http://localhost:8080
RUN envsubst '${VITE_API_URL} ${VITE_SOCKET_URL}' \
    < /etc/nginx/conf.d/default.conf.template \
    > /etc/nginx/conf.d/default.conf
EXPOSE 80
