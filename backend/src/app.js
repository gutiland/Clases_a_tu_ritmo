import express from 'express'
import classesRouter from './routes/classes.routes.js'
import programsRouter from './routes/programs.routes.js'
import tracksRouter from './routes/tracks.routes.js'
import usersRouter from './routes/users.routes.js'
import authRouter from './routes/auth.routes.js'
import workoutSessionsRouter from './routes/workoutSessions.routes.js'

const app = express()

app.use(express.json())

app.get('/api/health', (req,res)=>{
    res.json({message: 'API funcionando'})
})

app.use('/api/classes', classesRouter)
app.use('/api/users', usersRouter)
app.use('/api/programs', programsRouter)
app.use('/api/auth', authRouter)
app.use('/api/workouts', workoutSessionsRouter)
export default app
