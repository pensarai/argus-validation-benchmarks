FROM python:3.11-slim

RUN pip install --no-cache-dir flask \
    && apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY src/ /app/

EXPOSE 8111

CMD ["python", "app.py"]
