const context = new (window.AudioContext || window.webkitAudioContext)();
const scene = new ResonanceAudio(context);
scene.output.connect(context.destination);
scene.setListenerPosition(0, 0, 0);

const sources = [];

function getPosition(index) {
  const positions = [
    [5, 0, 2],
    [-5, 0, -2],
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
  sources.forEach((source) => {
    try {
      source.stop();
    } catch (e) {}
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
    clearTimeout(pomodoroTimeout);
    clearInterval(breathingInterval);
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
      if (files.length == 1){
        await loadSound(files[0], [0,0,0]);
      }else{
        for (let i = 0; i < files.length; i++) {
          await loadSound(files[i], getPosition(i));
        }
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

let selectedMode = "pomodoro";
let customMinutes = 15;
let pomodoroTimeout = null; 
let breathingInterval = null;
const modeInputs = document.querySelectorAll("input[name='mode']");
const customTimeInput = document.getElementById("custom-time-input");
const breathingOverlay = document.getElementById("breathing-overlay");

modeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    selectedMode = input.value;
    if (selectedMode === "custom") {
      customTimeInput.style.display = "inline";
    } else {
      customTimeInput.style.display = "none";
    }
  });
});

customTimeInput.addEventListener("input", (e) => {
  customMinutes = parseInt(e.target.value) || 15;
});

function iniciarPomodoroComSom(soundscapeId) {
  let foco = true;
  let ciclos = 0;
  const focoMin = 15;
  const pausaMin = 5;
  stopAll();
  clearInterval(breathingInterval);
  clearTimeout(pomodoroTimeout);

  function iniciarCiclo() {
    if (foco) {
      window.mindscape.playAudio(soundscapeId);
      console.log(`Pomodoro: Foco (${focoMin} min)`);
      pomodoroTimeout = setTimeout(() => {
        stopAll();
        foco = false;
        ciclos++;
        iniciarCiclo();
      }, focoMin * 60 * 1000);
    } else {
      console.log(`Pomodoro: Pausa (${pausaMin} min)`);
      pomodoroTimeout = setTimeout(() => {
        foco = true;
        iniciarCiclo();
      }, pausaMin * 60 * 1000);
    }
  }

  iniciarCiclo();
}

function iniciarSomPorTempo(soundscapeId, minutos) {
  stopAll();
  clearInterval(breathingInterval);
  window.mindscape.playAudio(soundscapeId);
  setTimeout(() => {
    window.mindscape.handleStopPlaying();
  }, minutos * 60 * 1000);
}

function iniciarSomRelaxamento(soundscapeId) {
  stopAll();
  clearInterval(breathingInterval);
  window.mindscape.playAudio(soundscapeId);
}

function iniciarRespiracaoGuiada(soundscapeId) {
  stopAll();
  window.mindscape.playAudio(soundscapeId);
  let etapa = 0;
  const etapas = [
    { cor: "rgba(173,216,230,0.4)", texto: "Inspire", tempo: 5000 },
    { cor: "rgba(255,255,0,0.3)", texto: "Prenda", tempo: 5000 },
    { cor: "rgba(255,182,193,0.4)", texto: "Expire", tempo: 5000 },
  ];

  function ciclo() {
    const atual = etapas[etapa % etapas.length];
    breathingOverlay.style.backgroundColor = atual.cor;
    etapa++;
    breathingInterval = setTimeout(ciclo, atual.tempo);
  }

  ciclo();
}

// Atualize handleSoundscapeClick
MindScape.prototype.handleSoundscapeClick = async function (id, buttonElement) {
  document.querySelectorAll(".soundscape-button").forEach((btn) => {
    btn.classList.remove("active");
  });
  buttonElement.classList.add("active");

  this.activeSoundscape = id;
  this.isPlaying = true;
  this.updatePlayingState();

  if (selectedMode === "pomodoro") {
    iniciarPomodoroComSom(id);
  } else if (selectedMode === "custom") {
    iniciarSomPorTempo(id, customMinutes);
  } else if (selectedMode === "breathing") {
    iniciarRespiracaoGuiada(id);
  } else if (selectedMode === "relaxing") {
    iniciarSomRelaxamento(id);
  }
};
