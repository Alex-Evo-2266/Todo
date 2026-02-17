# 1. Используем официальный Node.js-образ
FROM node:20-alpine AS deps

# 2. Установка зависимостей
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# 3. Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG CONTAINER_NAME=backend
ARG PORT=3000
ENV CONTAINER_NAME=$CONTAINER_NAME
ENV PORT=$PORT

RUN npm run build
RUN mkdir -p config
# RUN npm run generate:pages

# 4. Production-слой (минимальный)
FROM node:20-alpine AS runner

# Установим производственные зависимости только
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
RUN mkdir -p config
RUN mkdir -p config_local
COPY --from=builder /app/config ./config_local

RUN addgroup -S todo_service && adduser -S -G todo_service todo_service

# RUN groupadd todo_service
# RUN useradd -m -g todo_service todo_service -p PASSWORD
# RUN usermod -aG todo_service todo_service

COPY ./command.sh ./
RUN chown todo_service:todo_service command.sh
RUN chmod +x command.sh

USER todo_service

# Экспонируем порт (по умолчанию в Next.js — 3000)
# EXPOSE 3009

# Запускаем Next.js в production-режиме
# CMD ["npm", "run", "start"]
CMD ["sh", "./command.sh"]