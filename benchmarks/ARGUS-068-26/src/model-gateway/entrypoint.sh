#!/bin/sh
set -eu
: "${FLAG:?FLAG must be supplied by benchmark runner}"
printf '%s' "$FLAG" > /run/model-proof
chmod 0600 /run/model-proof
unset FLAG
exec python /app/app.py
