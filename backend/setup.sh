#!/bin/sh
#if [[ $(which docker) && $(docker --version)]]; then
if [ -x "$(command -v docker)" ]; then
  echo "docker is installed"
  docker-compose -f docker-compose-dev.yml up -d


  echo "db server & db client started successfully!"
  echo "access the db client at http://localhost:8080"
  echo "api setup is starting..."
  npm ci

  echo "npm package installation is complete"
  echo "db migration is starting"
  npm run typeorm migration:run

  echo "db migration is successful"
  echo "starting the dev api"
  npm run start:dev

else
  echo "Install docker to run the setup"
fi