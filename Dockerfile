# ---- deps stage ----
FROM node:20-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./

# Install dependencies inside Linux container
RUN npm ci --production

# ---- runtime stage ----
FROM node:20-slim AS runner
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* \
    && groupadd -r appgroup && useradd -r -g appgroup appuser

COPY --from=deps /app/node_modules ./node_modules
COPY backend/ ./

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/api/auth/status || exit 1

USER appuser

CMD ["node", "app.js"]
