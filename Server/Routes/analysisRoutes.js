import express from 'express'
import isAuthenticated from '../Middleware/authentication.js'
import {analyzeUrl,getAnalysis,getAnalyses,deleteAnalysis} from '../controllers/analysisController.js'

const analysisRouter = express.Router()


analysisRouter.post('/analyze',isAuthenticated,analyzeUrl)
analysisRouter.get('/list',isAuthenticated,getAnalyses)
analysisRouter.get('/:id',isAuthenticated,getAnalysis)
analysisRouter.delete('/:id',isAuthenticated,deleteAnalysis)

export default analysisRouter