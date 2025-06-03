FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN ls -la dist

FROM node:22-alpine AS production
COPY --from=builder /app/dist ./dist 
COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/package*.json ./ 
RUN npm install -g ts-node

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["sh", "-c", "node dist/main.js"]