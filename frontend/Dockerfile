FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


FROM node:22-alpine AS app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app/next.config.js .
COPY --from=build /app/.next .next
COPY --from=build /app/public public
COPY --from=build /app/node_modules node_modules

EXPOSE 3000
ENTRYPOINT [ "node_modules/.bin/next", "start" ]
