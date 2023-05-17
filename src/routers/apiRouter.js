import { Router } from "express";
import apiController from '../controllers/apiController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const apiRouter = new Router();

apiRouter.get('/articles?(page=\d+&limit=\d+)?', apiController.getArticles);
apiRouter.post('/articles', authMiddleware, apiController.addArticle);
apiRouter.put('/articles/:id', authMiddleware, apiController.editArticle);
apiRouter.delete('/articles/:id', authMiddleware, apiController.deleteArticle);

export default apiRouter;