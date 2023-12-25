FROM nginx:alpine

RUN apk add --no-cache libpq

ADD https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.3.2/grpc_health_probe-linux-amd64 /bin/grpc_health_probe

RUN chmod +x /bin/grpc_health_probe

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

ADD dist ./

ENTRYPOINT ["nginx", "-g", "daemon off;"]