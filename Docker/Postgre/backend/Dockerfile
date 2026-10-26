FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# npm ci respeta el lockfile exacto (reproducible y auditado por CI).
RUN npm ci --omit=dev

COPY src ./src

# Control C4 (M7, amenaza A5): no correr como root dentro del contenedor.
# La imagen node:20-alpine ya trae el usuario 'node' (uid 1000).
USER node

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s \
    CMD wget -qO- http://localhost:3000/health >/dev/null || exit 1

CMD ["node", "src/server.js"]
