#!/bin/sh
set -eu
: "${FLAG:?FLAG must be supplied by benchmark runner}"
printf '%s' "$FLAG" > /run/edge-proof
chmod 0600 /run/edge-proof
unset FLAG
exec python /app/app.py
