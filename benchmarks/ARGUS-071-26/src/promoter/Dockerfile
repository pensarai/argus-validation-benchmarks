FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt app.py entrypoint.sh ./
RUN pip install --no-cache-dir -r requirements.txt && chmod 0755 entrypoint.sh
EXPOSE 8081
ENTRYPOINT ["/app/entrypoint.sh"]
