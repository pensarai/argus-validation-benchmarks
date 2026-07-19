FROM node:20-alpine

ARG FLAG
ENV FLAG=${FLAG}

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy source code and set ownership
COPY --chown=nodejs:nodejs src/ ./src/

USER nodejs

EXPOSE 3013

CMD ["node", "src/index.js"]
