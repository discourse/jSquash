ARG RUST_IMG=rust:1.77
ARG WASM_PACK_VERSION=0.13.1

FROM $RUST_IMG AS rust
ARG RUST_IMG
ARG WASM_PACK_VERSION

RUN cargo install wasm-pack --version "$WASM_PACK_VERSION" --locked

WORKDIR /src
CMD ["sh", "-c", "rm -rf pkg && wasm-pack build --target web -- --verbose --locked && rm pkg/.gitignore"]
