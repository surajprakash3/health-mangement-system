# ─────────────────────────────────────────────────────────────────────────────
# Production-ready Backend Dockerfile
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine

# Install dumb-init for proper PID 1 signal handling
RUN apk add --no-cache dumb-init

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package*.json ./

# Install production dependencies only (no devDependencies)
RUN npm ci --only=production && npm cache clean --force

# Copy the application source
COPY . .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

# Ensure uploads directory exists and is owned by the app user
RUN mkdir -p uploads && chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 5000

# Use dumb-init as PID 1 for proper signal handling
CMD ["dumb-init", "node", "server.js"]