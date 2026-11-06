import { Router } from 'express';

const router = Router();

const status = {
  status: 'ok',
  api: 'ELLA API',
};

function sendStatus(req, res) {
  res.set('Cache-Control', 'no-store');
  status.timestamp = new Date().toISOString();
  res.json(status);
}

// GET /
router.get('/', sendStatus);

// GET /api/status
router.get('/api/status', sendStatus);

export default router;
