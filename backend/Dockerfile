# ==========================================
# Stage 1 : Build Stage
# ==========================================

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ==========================================
# Stage 2 : Production Stage
# ==========================================

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY .env ./

EXPOSE 5000

CMD ["npm", "start"]