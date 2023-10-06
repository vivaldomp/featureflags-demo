FROM golang:1.21.1 as builder

WORKDIR /build
COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -o flag .

FROM gcr.io/distroless/static-debian12

COPY public /bin/public
COPY --from=builder /build/flag /bin

CMD [ "flag" ]