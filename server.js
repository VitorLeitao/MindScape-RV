const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));

app.get('/getSoundscape/:id', (req, res) => {
  const id = req.params.id;

  const soundscapes = {
  relaxamentoPraiaChuva: ['/sounds/chuva.mp3', '/sounds/praia.mp3', '/sounds/passaro.mp3'],
  cabanaMontanha: ['/sounds/vento.mp3', '/sounds/fogueira.mp3'],
  meditacaoProfunda: ['/sounds/bineural_4hz.mp3', '/sounds/musica_calma_2.mp3', '/sounds/vento.mp3'],
  florestaAmanhecer: ['/sounds/passaro.mp3', '/sounds/vento.mp3'], // Adicionar som de arvore
  ambienteTerapeutico: ['/sounds/musica_calma_1.mp3', '/sounds/bineural_6hz.mp3', '/sounds/chuva.mp3'], // Diminuit musica
  refugioNoturno: ['/sounds/fogueira.mp3', '/sounds/vento.mp3', '/sounds/musica_calma_2.mp3'],// Diminuit musica
};

  if (soundscapes[id]) {
    res.json(soundscapes[id]);
  } else {
    res.status(404).json({ error: 'Soundscape não encontrado' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
