FROM node:lts-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# ENV NODE_ENV=production
RUN yarn build
#  && npm prune --production


# FROM node:lts-alpine AS app

# ENV NODE_ENV=production
# COPY --from=build /app/next.config.js ./
# COPY --from=build /app/public ./public
# COPY --from=build /app/.next ./.next
# COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
# ENTRYPOINT [ "node_modules/.bin/next", "start" ]
ENTRYPOINT [ "yarn", "start" ]
