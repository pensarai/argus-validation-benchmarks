FROM python:3.12-slim-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends squashfs-tools wget && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt app.py entrypoint.sh ./
COPY firmware-root /build/firmware-root
RUN mksquashfs /build/firmware-root /app/bmc-4.7.12.squashfs -noappend -comp xz >/dev/null \
    && rm -rf /build/firmware-root \
    && pip install --no-cache-dir -r requirements.txt \
    && chmod 0755 entrypoint.sh
EXPOSE 3066
ENTRYPOINT ["/app/entrypoint.sh"]
