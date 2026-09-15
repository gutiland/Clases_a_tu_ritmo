import Users from '../models/users/UsersSchema.js'

export const getUsers =async (req,res)=>{
    try{
        const allUsers = await Users.find().select('-password')
        return res.status(200).json(allUsers)
        
    }catch(error){
        return res.status(400).json({
            message:'error al obtener los usuarios',
            error: error.message})
    }
}

export const updateUserRole = async (req,res)=>{
    try {
        const {userId} = req.params
        const {role} = req.body

        const allowedRoles = ['client','trainer','admin']

        if(!allowedRoles.includes(role)){
            return res.status(400).json({
            message: 'Rol no válido'
      })
    }
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password')

    if (!updatedUser) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      })
    }

    return res.status(200).json(updatedUser)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el rol del usuario',
      error: error.message
    })
  }
}


export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params
    const loggedUserId = req.user._id.toString()
    const isOwnAccount = loggedUserId === userId
    const isAdminUser = req.user.role === 'admin'

    if (!isOwnAccount && !isAdminUser) {
      return res.status(403).json({
        message: 'No tienes permisos para borrar este usuario'
      })
    }

    const deletedUser = await Users.findByIdAndDelete(userId).select('-password')

    if (!deletedUser) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      })
    }

    return res.status(200).json({
      message: 'Usuario eliminado correctamente',
      user: deletedUser
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el usuario',
      error: error.message
    })
  }
}
