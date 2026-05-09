# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Build the React application
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package*.json ./

# Install — regenerates lock file if stale (avoids 'Missing from lock file' errors)
RUN npm install

# Copy the rest of the source
COPY . .

# Build the production bundle
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: Serve the static bundle with Nginx
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove the default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our SPA-aware nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Use exec form for proper signal handling
CMD ["nginx", "-g", "daemon off;"]