import {Router} from 'express'
import { createClass, getClassById, getClasses } from '../controllers/classes.controller.js'
import { isAuth, isTrainer } from '../middlewares/auth.middleware.js'
import tracksRouter from './tracks.routes.js'

const classesRouter = Router()
/* Crear clases: solo pueden crearlos trainers que esten registrados y logeados
 */

classesRouter.get('/', getClasses)
classesRouter.post('/', isAuth, isTrainer, createClass)
classesRouter.use('/:classId/tracks', tracksRouter)
classesRouter.get('/:classId', getClassById)

export default classesRouter
