#!/bin/bash
set -e  # завершить скрипт при любой ошибке
BASE_DIR="$(dirname "$(realpath "$0")")/.."

# Загружаем переменные из .env
export $(grep -v '^#' $BASE_DIR/.env | xargs)

# Собираем и поднимаем все сервисы
docker compose --env-file $BASE_DIR/.env \
  -f $BASE_DIR/docker-compose-base.yml \
  -f $BASE_DIR/AuthService/docker-compose-auth.yml \
  -f $BASE_DIR/docker-compose-todo.yml up
