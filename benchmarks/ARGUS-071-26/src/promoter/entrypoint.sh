#!/bin/sh
set -eu
: "${FLAG:?FLAG must be supplied by benchmark runner}"
printf '%s' "$FLAG" > /run/supply-proof
chmod 0600 /run/supply-proof
unset FLAG
exec python /app/app.py
