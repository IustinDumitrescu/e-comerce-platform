FROM php:8.4.16-fpm-alpine3.22
RUN apk add --no-cache \
        bash \
        postgresql-dev \
        rabbitmq-c-dev \
        autoconf \
        g++ \
        make \
        libc-dev \
        pkgconf \
        openssl-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && pecl install amqp \
    && docker-php-ext-enable amqp
WORKDIR /app
COPY . .
RUN chmod +x *.sh 
RUN ./composer-install.sh
EXPOSE 9000