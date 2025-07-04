const context = new (window.AudioContext || window.webkitAudioContext)();
const scene = new ResonanceAudio(context);
scene.output.connect(context.destination);
scene.setListenerPosition(0, 0, 0);

const sources = [];

function getPosition(index) {
  const positions = [
    [5, 0, 2],
    [-5, 0, -2]
  ];
  return positions[index] || [0, 0, 0];
}

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

function stopAll() {
  sources.forEach(source => {
    try { source.stop(); } catch (e) {}
  });
  sources.length = 0;
}

class MindScape {
  constructor() {
    this.activeSoundscape = null;
    this.isPlaying = false;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll(".soundscape-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        this.handleSoundscapeClick(id, e.currentTarget);
      });
    });

    document.getElementById("stop-button").addEventListener("click", () => {
      this.handleStopPlaying();
    });
  }

  async handleSoundscapeClick(id, buttonElement) {
    document.querySelectorAll(".soundscape-button").forEach((btn) => {
      btn.classList.remove("active");
    });
    buttonElement.classList.add("active");

    this.activeSoundscape = id;
    this.isPlaying = true;
    this.updatePlayingState();

    console.log(`Tocando soundscape: ${id}`);
    await this.playAudio(id); // Nova função de áudio real
  }

  handleStopPlaying() {
    this.isPlaying = false;
    this.activeSoundscape = null;

    document.querySelectorAll(".soundscape-button").forEach((btn) => {
      btn.classList.remove("active");
    });

    this.updatePlayingState();
    stopAll();
    console.log("Parado.");
  }

  updatePlayingState() {
    const appContainer = document.getElementById("app");
    const header = document.getElementById("header");
    const soundscapeGrid = document.getElementById("soundscape-grid");
    const playingOverlay = document.getElementById("playing-overlay");

    if (this.isPlaying) {
      appContainer.classList.add("playing");
      header.classList.add("faded");
      soundscapeGrid.classList.add("faded");
      playingOverlay.classList.add("visible");
    } else {
      appContainer.classList.remove("playing");
      header.classList.remove("faded");
      soundscapeGrid.classList.remove("faded");
      playingOverlay.classList.remove("visible");
    }
  }

  async playAudio(id) {
    stopAll();
    try {
      const response = await fetch(`/getSoundscape/${id}`);
      const files = await response.json(); // ex: ['chuva.mp3', 'vento.mp3']
      for (let i = 0; i < files.length; i++) {
        await loadSound(files[i], getPosition(i));
      }
    } catch (e) {
      console.error("Erro ao carregar som:", e);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.mindscape = new MindScape();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && window.mindscape) {
    window.mindscape.handleStopPlaying();
  }
});
