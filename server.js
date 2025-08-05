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
  relaxamentoPraiaChuva: ['/sounds/chuva.mp3', '/sounds/praia.mp3'],
  cabanaMontanha: ['/sounds/vento.mp3', '/sounds/passaro.mp3'],
  meditacaoProfunda: ['/sounds/fogueira.mp3', '/sounds/fogueira.mp3', '/sounds/bineural_4hz.mp3'],
  florestaAmanhecer: ['/sounds/vento.mp3', '/sounds/incetos_floresta.mp3'], 
  ambienteTerapeutico: ['/sounds/musica_calma_2.mp3', '/sounds/passaro.mp3'], // Diminuit musica
  refugioNoturno: ['/sounds/chuva_janela.mp3', '/sounds/incetos_floresta.mp3'],// Diminuit musica
  relaxamentoVento2D: ['/sounds/vento.mp3'],
  relaxamentoPraia2D: ['/sounds/chuva.mp3']
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
