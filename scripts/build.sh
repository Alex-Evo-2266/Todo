#!/bin/bash
set -e  # завершить скрипт при любой ошибке
BASE_DIR="$(dirname "$(realpath "$0")")/.."

# Загружаем переменные из .env
export $(grep -v '^#' $BASE_DIR/.env | xargs)

# Создаём сеть, если её ещё нет
if ! docker network ls | grep -q "^.*${NETWORK_NAME}.*$"; then
  echo "Создаём сеть ${NETWORK_NAME}..."
  docker network create "${NETWORK_NAME}"
  else
  echo "сеть ${NETWORK_NAME} уже создана"

fi

sh $BASE_DIR/scripts/modules_init.sh
sh $BASE_DIR/scripts/modules_update.sh

# sh $BASE_DIR/scripts/create_network.sh

# sh $BASE_DIR/scripts/copy_shared_lib.sh

sh $BASE_DIR/AuthService/scripts/build-libs.sh

# Собираем и поднимаем все сервисы
docker compose --env-file $BASE_DIR/.env \
  -f $BASE_DIR/docker-compose-base.yml \
  -f $BASE_DIR/AuthService/docker-compose-auth.yml \
  -f $BASE_DIR/docker-compose-todo.yml build

# Собираем и поднимаем все сервисы
# docker compose --env-file $BASE_DIR/.env \
#   -f $BASE_DIR/docker-compose-base.yml \
#   -f $BASE_DIR/AuthService/docker-compose-auth.yml \
#   -f $BASE_DIR/docker-compose-todo.yml up
