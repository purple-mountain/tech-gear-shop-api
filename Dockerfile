# syntax = docker/dockerfile:1

ARG NODE_VERSION=18.17.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NestJS/Prisma"

WORKDIR /app

ENV NODE_ENV="production"

ARG PNPM_VERSION=8.12.1
RUN npm install -g pnpm@$PNPM_VERSION


FROM base as build

RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

COPY --link package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile --prod=false

COPY --link prisma .
RUN npx prisma generate

COPY --link . .

RUN pnpm run build


FROM base

RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y openssl && \
  rm -rf /var/lib/apt/lists /var/cache/apt/archives

COPY --from=build /app /app

EXPOSE 3000
CMD [ "pnpm", "start" ]
