// Carrega as variáveis de ambiente do arquivo .env
import 'dotenv/config';

// O app com as configurações do express.
import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API executando em http://127.0.0.1:${PORT}`);
});
