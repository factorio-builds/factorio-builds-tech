FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
RUN npm run build


FROM node:22-alpine AS app

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist dist
COPY --from=build /app/public public
COPY --from=build /app/serve-prod.mjs serve-prod.mjs
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/package.json package.json

EXPOSE 3000
ENV PORT=3000
ENTRYPOINT [ "node", "serve-prod.mjs" ]
