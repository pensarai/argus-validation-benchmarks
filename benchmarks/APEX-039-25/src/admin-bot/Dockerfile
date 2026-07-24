FROM node:20-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV HOME=/home/botuser
ENV XDG_CONFIG_HOME=/home/botuser/.config
ENV XDG_CACHE_HOME=/home/botuser/.cache

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy application source
COPY src/ ./src/

# Create non-root user
RUN groupadd -r botuser && \
    useradd -r -m -d /home/botuser -g botuser botuser && \
    mkdir -p /home/botuser/.config /home/botuser/.cache && \
    chown -R botuser:botuser /app /home/botuser

USER botuser

EXPOSE 3001

CMD ["node", "src/bot.js"]
