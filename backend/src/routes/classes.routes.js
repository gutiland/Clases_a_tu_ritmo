import {Router} from 'express'
import { createClass, deleteClass, getClassById, getClasses, updateClass } from '../controllers/classes.controller.js'
import { isAuth, isTrainer } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/upload.middleware.js'
import tracksRouter from './tracks.routes.js'

const classesRouter = Router()
/* Crear clases: solo pueden crearlos trainers que esten registrados y logeados
 */

classesRouter.get('/', getClasses)
classesRouter.post('/', isAuth, isTrainer, upload.single('image'), createClass)
classesRouter.use('/:classId/tracks', tracksRouter)
classesRouter.get('/:classId', getClassById)
classesRouter.patch('/:classId', isAuth, isTrainer, upload.single('image'), updateClass)
classesRouter.delete('/:classId', isAuth, isTrainer, deleteClass)

export default classesRouter
