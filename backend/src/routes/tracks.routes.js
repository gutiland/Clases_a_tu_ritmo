import { Router } from 'express'
import {
  getTrackByClass,
  getTrackById,
  getTracks,
  getTracksByClass,
  createTrack
} from '../controllers/tracks.controller.js'
import { isAuth, isTrainer } from '../middlewares/auth.middleware.js'

const tracksRouter = Router({ mergeParams: true })

tracksRouter.get('/', (req, res) => {
  if (req.params.classId) {
    return getTracksByClass(req, res)
  }

  return getTracks(req, res)
})

tracksRouter.get('/:trackId', (req, res) => {
  if (req.params.classId) {
    return getTrackByClass(req, res)
  }

  return getTrackById(req, res)
})

tracksRouter.post('/', isAuth, isTrainer, createTrack)

export default tracksRouter
