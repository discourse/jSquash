import init, { decode, decodeAnimated, isAnimated } from '../../packages/gif/codec/pkg/squoosh_gif.js';

const status = document.getElementById('status');
const singleSection = document.getElementById('single-frame-section');
const animSection = document.getElementById('animation-section');
const singleCanvas = document.getElementById('single-canvas');
const animCanvas = document.getElementById('anim-canvas');
const singleInfo = document.getElementById('single-info');
const frameInfo = document.getElementById('frame-info');
const playBtn = document.getElementById('play-btn');

let animationId = null;
let playing = false;

function drawImageData(canvas, imageData) {
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
}

function playAnimation(canvas, frames) {
  let currentFrame = 0;
  playing = true;
  playBtn.textContent = 'Pause';

  function renderFrame() {
    const frame = frames[currentFrame];
    drawImageData(canvas, frame.imageData);
    frameInfo.textContent = `Frame ${currentFrame + 1} / ${frames.length} — ${frame.duration}ms`;
    currentFrame = (currentFrame + 1) % frames.length;
    animationId = setTimeout(renderFrame, frame.duration);
  }

  renderFrame();
}

function stopAnimation() {
  if (animationId !== null) {
    clearTimeout(animationId);
    animationId = null;
  }
  playing = false;
  playBtn.textContent = 'Play';
}

playBtn.addEventListener('click', () => {
  if (playing) {
    stopAnimation();
  } else if (playBtn._frames) {
    playAnimation(animCanvas, playBtn._frames);
  }
});

let initialized = false;

document.querySelector('form').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  stopAnimation();
  singleSection.hidden = true;
  animSection.hidden = true;
  status.textContent = 'Initializing WASM...';

  if (!initialized) {
    await init();
    initialized = true;
  }

  status.textContent = 'Decoding...';

  try {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);

    // Single frame decode
    const t0 = performance.now();
    const imageData = decode(data);
    const decodeTime = (performance.now() - t0).toFixed(1);
    drawImageData(singleCanvas, imageData);
    singleInfo.textContent = `${imageData.width}x${imageData.height} — decoded in ${decodeTime}ms`;
    singleSection.hidden = false;

    // Check if animated
    const animated = isAnimated(data);

    if (animated) {
      const t1 = performance.now();
      const frames = decodeAnimated(data);
      const animTime = (performance.now() - t1).toFixed(1);
      status.textContent = `Animated GIF: ${frames.length} frames decoded in ${animTime}ms`;
      playBtn._frames = frames;
      playAnimation(animCanvas, frames);
      animSection.hidden = false;
    } else {
      status.textContent = `Static GIF — decoded in ${decodeTime}ms`;
    }
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
    console.error(err);
  }
});
