build-darwin-local:
    go mod vendor
    go build -buildmode=c-shared -trimpath -o ./build/signer-arm64.dylib ./sharedlib/sharedlib.go

build-linux-local:
    go mod vendor
    go build -buildmode=c-shared -trimpath -o ./build/signer-amd64.so ./sharedlib/sharedlib.go

build-linux-docker:
    go mod vendor
    docker run --platform linux/amd64 -v $(pwd):/go/src/sdk golang:1.23.2-bullseye /bin/sh -c "cd /go/src/sdk && go build -buildmode=c-shared -trimpath -o ./build/signer-amd64.so ./sharedlib/sharedlib.go"

