### Local builds

build-darwin-local:
    go mod vendor
    go build -buildmode=c-shared -trimpath -o ./build/lighter-signer-darwin-arm64.dylib ./sharedlib/main.go

# Note: build-linux-local does not append -arm or amd64 at end
build-linux-local:
    go mod vendor
    CGO_ENABLED=1 go build -buildmode=c-shared -trimpath -o ./build/lighter-signer-linux.so ./sharedlib/main.go

# Note: build-windows-local does not append -arm or amd64 at end
# Windows build (requires gcc from msys2: choco install msys2)
# CMD:        set PATH=C:\msys64\mingw64\bin;%PATH% && set CGO_ENABLED=1 && go mod vendor && go build -buildmode=c-shared -trimpath -o ./build/signer-amd64.dll ./sharedlib/main.go
# PowerShell: $env:Path='C:\msys64\mingw64\bin;'+$env:Path; $env:CGO_ENABLED='1'; go mod vendor; go build -buildmode=c-shared -trimpath -o ./build/signer-amd64.dll ./sharedlib/main.go
build-windows-local:
    go mod vendor
    $env:Path='C:\msys64\mingw64\bin;'+$env:Path; $env:CGO_ENABLED='1'; go build -buildmode=c-shared -trimpath -o ./build/lighter-signer-windows.dll ./sharedlib/main.go

### Docker builds

# Note: I don't think this works TBH
#build-darwin-arm64-docker:
#    docker run --rm -v ${PWD}:/go/src/sdk -w /go/src/sdk golang:1.23.2-bullseye bash -c " \
#      cd /go/src/sdk && \
#      go build -buildmode=c-shared -trimpath -o ./build/lighter-signer-darwin-arm64.dylib ./sharedlib"

build-linux-amd64-docker:
    go mod vendor
    docker run --rm --platform linux/amd64 -v ${PWD}:/go/src/sdk -w /go/src/sdk golang:1.23.2-bullseye /bin/sh -c " \
      CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -buildmode=c-shared -trimpath -o ./build/lighter-signer-linux-amd64.so ./sharedlib"

build-linux-arm64-docker:
    go mod vendor
    docker run --rm --platform linux/arm64 -v ${PWD}:/go/src/sdk -w /go/src/sdk golang:1.23.2-bullseye /bin/sh -c " \
      CGO_ENABLED=1 GOOS=linux GOARCH=arm64 go build -buildmode=c-shared -trimpath -o ./build/lighter-signer-linux-arm64.so ./sharedlib"

build-windows-amd64-docker:
    go mod vendor
    docker run --rm --platform linux/amd64 -v ${PWD}:/go/src/sdk -w /go/src/sdk golang:1.23.2-bullseye bash -c " \
      apt-get update && \
      apt-get install -y gcc-mingw-w64-x86-64 && \
      CGO_ENABLED=1 GOOS=windows GOARCH=amd64 CC=x86_64-w64-mingw32-gcc go build -buildmode=c-shared -trimpath -o ./build/lighter-signer-windows-amd64.dll ./sharedlib"

### WASM builds

build-wasm:
    go mod vendor
    GOOS=js GOARCH=wasm go build -trimpath -o ./build/lighter-signer.wasm ./wasm/