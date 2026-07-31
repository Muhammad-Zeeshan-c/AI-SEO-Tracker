import express from "express";
import isAuthenticated from "../Middleware/authentication.js";
import {addKeyword,getKeywords,getKeyword,refreshKeyword,deleteKeyword,toggleTracking} from "../Controllers/rankController.js";


const rankRouter = express.Router();

rankRouter.post('/add',isAuthenticated,addKeyword)
rankRouter.get('/list',isAuthenticated,getKeywords)
rankRouter.get('/:id',isAuthenticated,getKeyword)
rankRouter.post('/:id/refresh',isAuthenticated,refreshKeyword)
rankRouter.put('/:id/toggle',isAuthenticated,toggleTracking)
rankRouter.delete('/:id',isAuthenticated,deleteKeyword)

export default rankRouter;