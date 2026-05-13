image := "cv-build"
uid := `id -u`
gid := `id -g`

# ----- Docker -----

[group("docker")]
[doc("Build the Docker image")]
docker-build:
    docker build -t {{image}} .

[group("docker")]
[doc("Regenerate package-lock.json via Docker")]
install:
    docker run --rm -u {{uid}}:{{gid}} -v $(pwd):/app -w /app node:22-alpine npm install

# ----- Build -----

[group("build")]
[doc("Build the CV and produce dist/index.html")]
build: docker-build
    mkdir -p dist
    docker run --rm -u {{uid}}:{{gid}} -v $(pwd)/dist:/app/dist {{image}}

[group("build")]
[doc("Build and open in the browser")]
preview: build
    xdg-open dist/index.html 2>/dev/null || open dist/index.html 2>/dev/null

[group("build")]
[doc("Remove build artifacts")]
clean:
    rm -rf dist

# ----- Audit -----

[group("audit")]
[doc("Run npm audit inside Docker")]
audit: docker-build
    docker run --rm {{image}} npm audit

# ----- Git -----

[group("git")]
[doc("Commit all changes with a message: just commit \"my message\"")]
commit message: build
    git add -A
    git commit -m "{{message}}"

[group("git")]
[doc("Commit and push to origin")]
push message: (commit message)
    git push
