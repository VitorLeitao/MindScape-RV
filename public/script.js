const context = new (window.AudioContext || window.webkitAudioContext)();
const scene = new ResonanceAudio(context);
scene.output.connect(context.destination);
scene.setListenerPosition(0, 0, 0);

const sources = [];

async function loadSound(url, position) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(buffer);

  const source = context.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;

  const node = scene.createSource();
  source.connect(node.input);
  node.setPosition(...position);

  source.start();
  sources.push(source);
}

function getPosition(index) {
  const positions = [
    [5, 0, 2],   // Primeira fonte
    [-5, 0, -2]  // Segunda fonte
  ];
  return positions[index] || [0, 0, 0];
}

async function playSelected() {
  stopAll();

  const selected = document.getElementById('soundSelect').value;
  if (!selected) return;

  const response = await fetch(`/${selected}`);
  const files = await response.json();

  for (let i = 0; i < files.length; i++) {
    await loadSound(files[i], getPosition(i));
  }
}

function stopAll() {
  sources.forEach(source => {
    try { source.stop(); } catch (e) {}
  });
  sources.length = 0;
}
