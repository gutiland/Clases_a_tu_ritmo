import Programs from '../models/programs/ProgramsSchema.js'

export const getPrograms =async (req,res)=>{
    try{
        const allPrograms = await Programs.find()
        return res.status(200).json(allPrograms)
        
    }catch(error){
        return res.status(400).json({
            message:'error al obtener los programas',
            error: error.message})
    }
}
