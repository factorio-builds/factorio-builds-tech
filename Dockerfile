FROM node:12.19.1-alpine

# Set workdir
WORKDIR /app

# Add package file
COPY package.json .

# Install deps
RUN yarn --frozen-lockfile

# Copy source
COPY . .

# Build dist
RUN yarn build

# Expose port
EXPOSE 3000

CMD yarn start
