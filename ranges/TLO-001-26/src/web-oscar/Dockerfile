FROM python:3.11-slim

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir flask psycopg2-binary

WORKDIR /app
COPY src/ /app/

EXPOSE 80

CMD ["python", "app.py"]
