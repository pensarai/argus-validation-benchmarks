FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    samba \
    smbclient \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir flask markdown pykeepass

COPY shares/ /srv/shares/
COPY src/ /app/
COPY smb.conf /etc/samba/smb.conf

WORKDIR /app

EXPOSE 80 139 445

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
