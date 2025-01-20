import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

export const healthRoutes = router; 