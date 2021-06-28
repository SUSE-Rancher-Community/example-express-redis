# Example NodeJS app using Express and Redis

## Deploy to Epinio

`epinio push example-express-redis`

## Building locally with pack

`pack build npm-sample --buildpack gcr.io/paketo-buildpacks/nodejs`

## Running locally on Docker

`docker run --interactive --tty --publish 8080:8080 npm-sample`
