FROM python:3.11-alpine

RUN apk add --no-cache iptables socat curl

WORKDIR /app

COPY entrypoint.py /app/

EXPOSE 8080

CMD ["python", "entrypoint.py"]
