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

RUN groupadd -r appgroup && useradd -r -g appgroup appuser

COPY --from=deps /app/node_modules ./node_modules
COPY backend/ ./

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

USER appuser

CMD ["node", "app.js"]
