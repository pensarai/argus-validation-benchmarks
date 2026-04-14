FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir flask \
    && apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY src/ /app/

EXPOSE 8443

CMD ["python", "app.py"]
