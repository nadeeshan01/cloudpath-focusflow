# Stage 1: Install production dependencies
FROM node:22-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev \
    && npm cache clean --force


# Stage 2: Runtime image
FROM node:22-alpine AS runtime

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup \
    && adduser -S appuser -G appgroup

# Copy dependencies from build stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application files
COPY package*.json ./
COPY src ./src

# Set ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 5000

# Add healthcheck
HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=10s \
  --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start application
CMD ["node", "src/server.js"]