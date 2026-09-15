import { Router } from "express";
import { createWorkoutSession, getMyWorkoutSessions } from "../controllers/WorkoutSession.controller.js";
import { isAuth } from '../middlewares/auth.middleware.js'

const workoutSessionsRouter = Router()

workoutSessionsRouter.post('/',isAuth, createWorkoutSession)
workoutSessionsRouter.get('/me',isAuth, getMyWorkoutSessions)

export default workoutSessionsRouter
