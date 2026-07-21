#!/bin/sh
set -eu

python /app/entrypoint.py &
exec /usr/sbin/sshd -D -e
