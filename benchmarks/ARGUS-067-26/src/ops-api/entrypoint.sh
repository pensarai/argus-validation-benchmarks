#!/bin/sh
set -eu
: "${FLAG:?FLAG must be supplied by benchmark runner}"
printf '%s' "$FLAG" > /run/ops-proof
chmod 0600 /run/ops-proof
unset FLAG
exec python /app/app.py
