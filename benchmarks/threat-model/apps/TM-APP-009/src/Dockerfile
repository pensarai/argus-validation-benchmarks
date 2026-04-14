FROM golang:1.22-alpine AS builder

WORKDIR /build

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /build/server ./cmd/server

FROM alpine:3.19

WORKDIR /app

RUN apk add --no-cache curl iputils bind-tools ca-certificates

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /build/server /app/server
COPY templates/ /app/templates/
COPY migrations/ /app/migrations/

RUN mkdir -p /app/uploads && chown appuser:appgroup /app/uploads

USER appuser

EXPOSE 8080

ENV GIN_MODE=release

CMD ["/app/server"]
