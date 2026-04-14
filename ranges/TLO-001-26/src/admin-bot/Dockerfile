FROM node:20-slim

RUN apt-get update && apt-get install -y \
    chromium \
    curl \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
RUN npm init -y && npm install puppeteer

COPY src/bot.js /app/

CMD ["node", "bot.js"]
