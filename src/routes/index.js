import express from 'express';
import ApiRoutes from './api/index.js';

const router = express.Router();

router.use('/api', ApiRoutes);

export default router;
