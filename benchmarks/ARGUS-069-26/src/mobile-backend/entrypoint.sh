#!/bin/sh
set -eu
: "${FLAG:?FLAG must be supplied by benchmark runner}"
printf '%s' "$FLAG" > /run/mobile-proof
chmod 0600 /run/mobile-proof
unset FLAG
exec python /app/app.py
