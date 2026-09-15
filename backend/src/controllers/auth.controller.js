import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Users from '../models/users/UsersSchema.js'


export const register = async(req,res)=>{
    try {
        const {name, email, password, role,avatar} = req.body

        const userExist = await Users.findOne({email})
        if(userExist) return res.status(400).json('el usuario ya existe')
        
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await Users.create({
            name,
            email,
            password:hashedPassword,
            role,
            avatar
        })
        return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      }
    })
    } catch (error) {
        return res.status(500).json({
      message: 'Error al registrar usuario',
      error: error.message
    })
    }
}

export const login = async(req,res)=>{
    try {
        const {email, password} = req.body
        const user = await Users.findOne({email})
        if(!user) return res.status(400).json('Usuario o contraseña incorrectos')

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email o contraseña incorrectos'
      })
      
    }
    const token = jwt.sign(
        {
            id:user._id,
            role: user.role
        }, process.env.JWT_SECRET,{
            expiresIn:'7d'
        }
    )
    return res.status(200).json({
      message: 'Login correcto',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    })
    } catch (error) {
        return res.status(500).json({
      message: 'Error al iniciar sesión',
      error: error.message
    })
    }
}