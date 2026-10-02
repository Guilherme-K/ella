import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

const usuarios = {};

app.post('/usuarios', (req, res) => {
  const { nome, email } = req.body;
  const id = uuidv4();
  if (usuarios.nome === undefined || usuarios.email === undefined) {
        res.status(400).json({msg: "informação faltando"});
    }
  usuarios[id] = { id, nome, email };
  res.status(201).json(usuarios[id]);
});

app.get('/usuarios', (req, res) => {
  res.json(Object.values(usuarios));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://127.0.0.1:${PORT}`);
});
