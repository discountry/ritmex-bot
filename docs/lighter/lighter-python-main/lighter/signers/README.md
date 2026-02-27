# Lighter Signers

This directory contains various signer implementations for the Lighter Protocol.

## Usage

The Python SDK automatically selects the correct native binary signer based on your platform:


| Platform | Architecture          | Binary                              |
|----------|-----------------------|-------------------------------------|
| Linux    | x86_64                | `lighter-signer-linux-amd64.so`     |
| Linux    | ARM64                 | `lighter-signer-linux-amd64.so`     |
| macOS    | ARM64 (Apple Silicon) | `lighter-signer-darwin-arm64.dylib` |
| Windows  | x86_64                | `lighter-signer-windows-amd64.dll`  |

No additional configuration is required - the SDK detects your platform and loads the appropriate signer. \
If you encounter issues with missing binaries, ensure the appropriate signer binary is present in this directory.

## Building Signers

These binaries are compiled from the Go implementation in [lighter-go](https://github.com/elliottech/lighter-go) and
provide high-performance cryptographic operations for the Lighter Protocol. \
There are `.h` files for easier integrations in other languages, like C, C++, Rust. \
For building the signers yourself, you can find the steps in the lighter-go repo.
