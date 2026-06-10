FROM alpine:latest

# Install ca-certificates, unzip, and wget
RUN apk add --no-cache ca-certificates unzip wget

# Define the PocketBase version
ENV PB_VERSION=0.38.0

# Download and unzip PocketBase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${PB_VERSION}_linux_amd64.zip -d /pb \
    && rm pocketbase_${PB_VERSION}_linux_amd64.zip

# Expose default HTTP port
EXPOSE 8090

# Set working directory
WORKDIR /pb

# Copy database migrations and custom hooks into the image
COPY pb_migrations ./pb_migrations
COPY pb_hooks ./pb_hooks

# Run PocketBase serve
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--encryptionEnv=PB_ENCRYPTION_KEY", "--dir=/pb/pb_data", "--migrationsDir=/pb/pb_migrations", "--hooksDir=/pb/pb_hooks", "--hooksWatch=false"]
