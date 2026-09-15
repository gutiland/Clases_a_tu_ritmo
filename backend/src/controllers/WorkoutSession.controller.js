import WorkoutSessions from '../models/workoutSessions/WorkoutSessionsSchema.js'
import Classes from '../models/classes/ClassesSchema.js'


export const createWorkoutSession = async(req, res)=>{
    try {
        const {classId, completedTracks = []} = req.body

        const classExist = await Classes.findById(classId)

        if(!classExist){
            return res.status(404).json({
                message: 'Clase no encontrada'
            })
        }
        const workoutSession = await WorkoutSessions.create({
            user:req.user._id,
            class: classId,
            completedTracks,
            completed:true,
            completedAt: new Date()
        })

        const populatedSession = await workoutSession.populate([
             { path: 'user', select: '-password' },
            {path: 'class',
                populate: [
                { path: 'program' },
                { path: 'trainer', select: '-password' }
                ]
            },
            { path: 'completedTracks' }
        ])
        return res.status(201).json(populatedSession)
    } catch (error) {
        return res.status(400).json({
            message:'No se ha podido guardar la sesión',
            error: error.message
        })
    }
}


export const getMyWorkoutSessions = async (req, res) => {
  try {
    const sessions = await WorkoutSessions.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .populate({
        path: 'class',
        populate: [
          { path: 'program' },
          { path: 'trainer', select: '-password' }
        ]
      })
      .populate('completedTracks')

    return res.status(200).json(sessions)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener tus sesiones',
      error: error.message
    })
  }
}
