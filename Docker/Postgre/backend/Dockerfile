FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s \
    CMD wget -qO- http://localhost:3000/health >/dev/null || exit 1

CMD ["node", "src/server.js"]
