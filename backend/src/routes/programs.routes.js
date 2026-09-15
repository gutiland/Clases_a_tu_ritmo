import { Router } from 'express'
import { getPrograms } from '../controllers/programs.controller.js'

const programsRouter = Router()

programsRouter.get('/', getPrograms)

export default programsRouter