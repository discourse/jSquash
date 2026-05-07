# @jsquash/gif

[![npm version](https://badge.fury.io/js/@jsquash%2Fgif.svg)](https://badge.fury.io/js/@jsquash%2Fgif)

An easy way to decode GIF images in the browser with WebAssembly.

Uses the [Rust gif crate](https://docs.rs/gif).

A [jSquash](https://github.com/jamsinclair/jSquash) package.

## Installation

```shell
npm install --save @jsquash/gif
```

## Usage

Note: You will need to either manually include the wasm files from the codec directory or use a bundler like WebPack or Rollup to include them in your app/server.

### `decode(data: ArrayBuffer): Promise<ImageData>`

Decodes GIF binary data to `ImageData`.

```js
import { decode } from '@jsquash/gif';

const imageBuffer = await fetch('/example.gif').then((res) => res.arrayBuffer());
const imageData = await decode(imageBuffer);
```

### `decodeAnimated(data: ArrayBuffer): Promise<GIFFrame[]>`

Decodes all GIF animation frames.

```js
import { decodeAnimated } from '@jsquash/gif';

const imageBuffer = await fetch('/animated.gif').then((res) => res.arrayBuffer());
const frames = await decodeAnimated(imageBuffer);
```

### `isAnimated(data: ArrayBuffer): Promise<boolean>`

Checks whether the GIF contains more than one frame.

```js
import { isAnimated } from '@jsquash/gif';

const imageBuffer = await fetch('/image.gif').then((res) => res.arrayBuffer());
const animated = await isAnimated(imageBuffer);
```

## Manual WASM initialisation (not recommended)

The `decode` module exports an `init` function that can be used to manually load the wasm module.

```js
import decode, { init as initGifDecode } from '@jsquash/gif/decode';

initGifDecode(WASM_MODULE);
const image = await fetch('./image.gif').then((res) => res.arrayBuffer()).then(decode);
```
