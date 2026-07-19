#!/bin/sh
set -eu
: "${FLAG:?FLAG must be supplied by benchmark runner}"
printf '%s' "$FLAG" > /run/bmc-proof
chmod 0600 /run/bmc-proof
unset FLAG
exec python /app/app.py
