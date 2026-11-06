import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { prismaErrorHandler } from './lib/prisma.js';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rotas da aplicação.
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
  });
});

// Tratamento centralizado de erros.
app.use((err, req, res, next) => {
  console.error(err);

  const error = prismaErrorHandler(err);
  const statusCode = error.status || err.status || 500;

  res.status(statusCode).json({
    error:
      statusCode !== 500
        ? error.message || err.message
        : 'Internal server 500',
  });
});

export default app;
