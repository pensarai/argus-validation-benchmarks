FROM golang:1.22-alpine AS builder

RUN apk add --no-cache git ca-certificates

WORKDIR /build

# Copy workspace file and all modules
COPY go.work go.work.sum ./
COPY api-gateway/ ./api-gateway/
COPY auth-service/proto/ ./auth-service/proto/
COPY order-service/proto/ ./order-service/proto/
COPY notification-service/proto/ ./notification-service/proto/

# Copy stub go.mod files for proto dependencies
COPY auth-service/go.mod ./auth-service/go.mod
COPY auth-service/go.sum ./auth-service/go.sum
COPY order-service/go.mod ./order-service/go.mod
COPY order-service/go.sum ./order-service/go.sum
COPY notification-service/go.mod ./notification-service/go.mod
COPY notification-service/go.sum ./notification-service/go.sum

WORKDIR /build/api-gateway
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/gateway ./main.go

FROM alpine:3.19

RUN apk add --no-cache ca-certificates curl

WORKDIR /app
COPY --from=builder /app/gateway .

EXPOSE 8080

CMD ["./gateway"]
