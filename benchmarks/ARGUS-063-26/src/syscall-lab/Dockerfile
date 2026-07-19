FROM debian:bookworm-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends build-essential libseccomp-dev
COPY seccomp-exec.c /src/seccomp-exec.c
RUN cc -O2 -Wall -Wextra -o /out-seccomp-exec /src/seccomp-exec.c -lseccomp

FROM python:3.12-slim-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libc6-dev libseccomp2 wget \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt app.py entrypoint.sh ./
COPY --from=build /out-seccomp-exec /usr/local/bin/seccomp-exec
RUN pip install --no-cache-dir -r requirements.txt && chmod 0755 entrypoint.sh /usr/local/bin/seccomp-exec
EXPOSE 3063
ENTRYPOINT ["/app/entrypoint.sh"]
