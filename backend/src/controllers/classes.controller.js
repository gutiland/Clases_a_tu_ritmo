import Classes from '../models/classes/ClassesSchema.js'
import Programs from '../models/programs/ProgramsSchema.js'

export const getClasses =async (req,res)=>{
    try{
        const allClasses = await Classes.find()
        .populate('program')
        .populate('trainer', '-password')
        return res.status(200).json(allClasses)
        
    }catch(error){
        return res.status(400).json({
            message:'error al obtener las clases',
            error: error.message})
    }
}
export const getClassById = async(req, res)=>{
    try{
        const {classId} = req.params

        const ClassItem = await Classes.findById(classId)
        .populate('program')
        .populate('trainer', '-password')
        if(!ClassItem) {return res.status(404).json({
            message:'clase no encontrada'
        })}
        return res.status(200).json(ClassItem)
    }catch(error){
        return res.status(500).json({
      message: 'Error al obtener la clase',
      error: error.message
    })

    }
}

export const createClass = async (req, res) => {
    try {
        const { title, program, level, duration, image } = req.body

        const programExists = await Programs.findById(program)
        if(!programExists){
             return res.status(404).json({
                message: 'Programa no encontrado'
            })
        }

        const newClass = await Classes.create({
            title,
            program,
            trainer: req.user._id,
            level,
            duration,
            image
        })

        const populatedClass = await newClass.populate([
            { path: 'program' },
            { path: 'trainer', select: '-password' }
        ])

        return res.status(201).json(populatedClass)
    } catch (error) {
        return res.status(500).json({
            message: 'Error al crear la clase',
            error: error.message
        })
    }
}
