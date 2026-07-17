# Docker image shared by the GitHub webhook deployment receiver and the
# Kural Studio API — both are plain Express services, so one image with two
# `command:` overrides in docker-compose.yml keeps a single build to maintain.
# Requires `express` and `googleapis` to be declared in package.json.
FROM node:20-alpine

# git is needed for `git fetch` / `git reset --hard` during deployment.
RUN apk add --no-cache git

WORKDIR /app

# Install production dependencies first for better layer caching.
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY deploy-webhook.js studio-server.js image-server.js ./
COPY server/ ./server/

ENV NODE_ENV=production \
    PORT=3600

EXPOSE 3600 3700

# Default command runs the webhook receiver; docker-compose overrides
# `command:` to `node studio-server.js` for the studio service.
CMD ["node", "deploy-webhook.js"]
