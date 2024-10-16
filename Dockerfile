# Stage 1
FROM node:18-alpine3.20 AS builder
WORKDIR /serverbuild
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2
FROM node:18-alpine3.20 AS runner
WORKDIR /server
COPY --from=builder /serverbuild/package*.json ./package.json
COPY --from=builder /serverbuild/node_modules ./node_modules
COPY --from=builder /serverbuild/dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
