import jwt from 'jsonwebtoken'
import Users from '../models/users/UsersSchema.js'

export const isAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization

    if (!authorization) {
      return res.status(401).json({
        message: 'No hay token'
      })
    }

    const token = authorization.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await Users.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        message: 'Usuario no encontrado'
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido',
      error: error.message
    })
  }
}

export const isTrainer = (req, res, next) => {
  if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'No tienes permisos para realizar esta acción'
    })
  }

  next()
}

export const isAdmin = (req, res, next) =>{
  if(req.user.role !== 'admin'){
    return res.status(403).json({
      message: 'Solo administradores está autizados a esta acción'
    })
  }
  next()
}