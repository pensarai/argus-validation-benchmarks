# Stage 1: Build
FROM rust:1.75-bookworm AS builder

WORKDIR /build

# Cache dependency compilation
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo 'fn main() {}' > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Build actual binary
COPY src/ ./src/
RUN touch src/main.rs && cargo build --release

# Stage 2: Runtime
FROM debian:bookworm-slim AS runtime

RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd --system appgroup && \
    useradd --system --gid appgroup --create-home appuser

COPY --from=builder /build/target/release/fileproc /usr/local/bin/fileproc

RUN mkdir -p /data/output && chown appuser:appgroup /data/output

USER appuser

WORKDIR /data

ENTRYPOINT ["fileproc"]
CMD ["--help"]
