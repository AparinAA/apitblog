import { Router } from "express";
import { apiController } from '../controllers/apiController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const apiRouter = new Router();

apiRouter.get('/articles?(page=\d+&limit=\d+)?', apiController.getArticlesSave);
apiRouter.post('/articles', authMiddleware, apiController.addArticleSave);
apiRouter.put('/articles/:id', authMiddleware, apiController.editArticleSave);
apiRouter.delete('/articles/:id', authMiddleware, apiController.deleteArticleSave);

export default apiRouter;