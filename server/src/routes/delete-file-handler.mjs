import express from 'express';
import { deleteFile } from '../controllers/delete-file-controller.mjs';
import { authMiddleware } from '../middlewares/auth.mjs';

const router = express.Router();

// Delete an uploaded file
/* 
:filename is a dynamic parameter that captures the name of the file to be deleted
The file name is sent from the frontend when the endpoint is hit
*/
router.delete('/delete-file/:filename', authMiddleware, deleteFile);

export default router;
