import express from 'express';
import { getStoredFiles } from '../controllers/get-files-controller.mjs';

const router = express.Router();

router.get('/getFiles', getStoredFiles);

export default router;
