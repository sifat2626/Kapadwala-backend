import express from 'express';
import { EmailController } from './email.controller';
import protect from '../../middlewares/protect';

const router = express.Router();

router.post('/send-welcome', protect(), EmailController.sendWelcomeEmail);

export const EmailRoutes = router;
