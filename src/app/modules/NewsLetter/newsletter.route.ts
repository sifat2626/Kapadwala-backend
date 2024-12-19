import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { NewsletterController } from './newsletter.controller'

const router = express.Router();

// Manually trigger the newsletter
router.post('/send', auth(USER_ROLE.admin, USER_ROLE.superAdmin), NewsletterController.sendNewsletterManually);

export const NewsletterRoutes = router;
