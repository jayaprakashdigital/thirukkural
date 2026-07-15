# Docker image for the GitHub webhook deployment receiver.
# Requires `express` to be declared in package.json.
FROM node:20-alpine

# git is needed for `git fetch` / `git reset --hard` during deployment.
RUN apk add --no-cache git

WORKDIR /app

# Install production dependencies first for better layer caching.
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY deploy-webhook.js ./

ENV NODE_ENV=production \
    PORT=3600

EXPOSE 3600

# Dumb-init ensures graceful signal handling so Ctrl+C / docker stop work cleanly.
CMD ["node", "deploy-webhook.js"]
