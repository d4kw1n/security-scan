# Sử dụng image Node.js 18 Alpine
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN if [ ! -f package.json ]; then \
    echo '{"name": "npm-audit-container", "version": "1.0.0", "description": "Docker container for npm audit", "dependencies": {}}' > package.json; \
    fi && \
    if [ -f package-lock.json ]; then \
    npm ci --omit=dev; \
    else \
    npm install --omit=dev; \
    fi

RUN npm install -g npm@10

CMD ["npm", "audit", "--json"]