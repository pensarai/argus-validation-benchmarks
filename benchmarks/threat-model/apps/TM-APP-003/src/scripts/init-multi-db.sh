#!/bin/bash
set -e

# Create multiple databases for different services
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE tm_auth;
    CREATE DATABASE tm_orders;
    GRANT ALL PRIVILEGES ON DATABASE tm_auth TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE tm_orders TO $POSTGRES_USER;
EOSQL
