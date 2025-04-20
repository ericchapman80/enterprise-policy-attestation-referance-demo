FROM golang:1.19-alpine AS builder

WORKDIR /app
COPY validator.go go.mod go.sum ./
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o validator .

FROM alpine:3.16
WORKDIR /app
COPY --from=builder /app/validator .
RUN chmod +x /app/validator

ENTRYPOINT ["/app/validator"]
