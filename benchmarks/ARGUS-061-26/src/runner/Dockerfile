FROM python:3.12-alpine

RUN apk add --no-cache wget
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .

EXPOSE 3061
CMD ["python", "app.py"]
