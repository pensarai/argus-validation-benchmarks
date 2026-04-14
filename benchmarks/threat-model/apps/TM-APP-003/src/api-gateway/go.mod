module github.com/tm-app-003/api-gateway

go 1.22.0

require (
	github.com/gin-gonic/gin v1.9.1
	github.com/go-redis/redis/v8 v8.11.5
	github.com/rs/zerolog v1.32.0
	github.com/tm-app-003/auth-service v0.0.0
	github.com/tm-app-003/order-service v0.0.0
	github.com/tm-app-003/notification-service v0.0.0
	google.golang.org/grpc v1.62.1
)

replace (
	github.com/tm-app-003/auth-service => ../auth-service
	github.com/tm-app-003/order-service => ../order-service
	github.com/tm-app-003/notification-service => ../notification-service
)
