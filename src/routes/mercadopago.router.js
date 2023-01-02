import { Router } from "express";
import { createPreference, notification } from '../controllers/mercadopago.controller.js';

const router = Router();

router.post('/', createPreference)
router.post('/webhook', notification)


export default router;
