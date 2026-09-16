import Classes from '../models/classes/ClassesSchema.js'
import Programs from '../models/programs/ProgramsSchema.js'
import cloudinary from '../config/cloudinary.js'
import Tracks from '../models/tracks/TracksSchema.js'
import WorkoutSessions from '../models/workoutSessions/WorkoutSessionsSchema.js'

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

        let imageUrl = image || ''

        let imagePublicId = ''

        if (req.file) {
            const uploadedImage = await uploadClassImage(req.file)
            imageUrl = uploadedImage.url
            imagePublicId = uploadedImage.publicId
        }

        const newClass = await Classes.create({
            title,
            program,
            trainer: req.user._id,
            level,
            duration,
            image: imageUrl,
            imagePublicId
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


const canManageClass = (user, classItem) => {
    return user.role === 'admin' || classItem.trainer.toString() === user._id.toString()
}

const uploadClassImage = async (file) => {
    const imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
        folder: 'clases-a-tu-ritmo/classes'
    })

    return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
    }
}

const deleteCloudinaryImage = async (publicId) => {
    if (!publicId) return

    await cloudinary.uploader.destroy(publicId)
}

export const updateClass = async (req, res) => {
    try {
        const { classId } = req.params
        const { title, program, level, duration, image } = req.body

        const classItem = await Classes.findById(classId)

        if (!classItem) {
            return res.status(404).json({
                message: 'Clase no encontrada'
            })
        }

        if (!canManageClass(req.user, classItem)) {
            return res.status(403).json({
                message: 'No tienes permisos para editar esta clase'
            })
        }

        if (program) {
            const programExists = await Programs.findById(program)

            if (!programExists) {
                return res.status(404).json({
                    message: 'Programa no encontrado'
                })
            }

            classItem.program = program
        }

        if (title) classItem.title = title
        if (level) classItem.level = level
        if (duration) classItem.duration = Number(duration)
        if (image) {
            if (classItem.imagePublicId) {
                await deleteCloudinaryImage(classItem.imagePublicId)
            }

            classItem.image = image
            classItem.imagePublicId = ''
        }

        if (req.file) {
            const previousImagePublicId = classItem.imagePublicId
            const uploadedImage = await uploadClassImage(req.file)

            classItem.image = uploadedImage.url
            classItem.imagePublicId = uploadedImage.publicId

            await deleteCloudinaryImage(previousImagePublicId)
        }

        await classItem.save()

        const populatedClass = await classItem.populate([
            { path: 'program' },
            { path: 'trainer', select: '-password' }
        ])

        return res.status(200).json(populatedClass)
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar la clase',
            error: error.message
        })
    }
}

export const deleteClass = async (req, res) => {
    try {
        const { classId } = req.params
        const classItem = await Classes.findById(classId)

        if (!classItem) {
            return res.status(404).json({
                message: 'Clase no encontrada'
            })
        }

        if (!canManageClass(req.user, classItem)) {
            return res.status(403).json({
                message: 'No tienes permisos para eliminar esta clase'
            })
        }

        await deleteCloudinaryImage(classItem.imagePublicId)
        await Tracks.deleteMany({ class: classId })
        await WorkoutSessions.deleteMany({ class: classId })
        await Classes.findByIdAndDelete(classId)

        return res.status(200).json({
            message: 'Clase eliminada correctamente'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar la clase',
            error: error.message
        })
    }
}
