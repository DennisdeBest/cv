image := "cv-build"
uid := `id -u`
gid := `id -g`

# Build the Docker image
docker-build:
    docker build -t {{image}} .

# Regenerate package-lock.json via Docker
install:
    docker run --rm -u {{uid}}:{{gid}} -v $(pwd):/app -w /app node:22-alpine npm install

# Build the CV (produces dist/index.html)
build: docker-build
    mkdir -p dist
    docker run --rm -u {{uid}}:{{gid}} -v $(pwd)/dist:/app/dist {{image}}

# Build and open in browser
preview: build
    xdg-open dist/index.html 2>/dev/null || open dist/index.html 2>/dev/null

# Run npm audit
audit: docker-build
    docker run --rm {{image}} npm audit

# Remove build artifacts
clean:
    rm -rf dist
