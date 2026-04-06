#!/bin/bash
# Development environment startup script

set -e

echo "Starting TraceFlow development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Use docker compose command (new version) or docker-compose (old version)
if command -v docker compose &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Navigate to docker directory
cd "$(dirname "$0")"

# Start the services
echo "Starting services..."
$COMPOSE_CMD up -d

# Wait for services to be healthy
echo "Waiting for services to be ready..."
sleep 10

# Check backend health
echo "Checking backend health..."
for i in {1..30}; do
    if curl -f http://localhost:8080/api/actuator/health &> /dev/null; then
        echo "Backend is healthy!"
        break
    fi
    echo "Waiting for backend... ($i/30)"
    sleep 2
done

# Check frontend
echo "Checking frontend..."
if curl -f http://localhost:3000 &> /dev/null; then
    echo "Frontend is ready!"
else
    echo "Frontend might still be starting..."
fi

echo ""
echo "==================================="
echo "TraceFlow is now running!"
echo "==================================="
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8080/api"
echo "PostgreSQL: localhost:5432"
echo ""
echo "To view logs: $COMPOSE_CMD logs -f"
echo "To stop: $COMPOSE_CMD down"
echo "==================================="
