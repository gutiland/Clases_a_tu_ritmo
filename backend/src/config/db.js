import mongoose from 'mongoose'


export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('MongoDB Conectado')
    } catch (error) {
     console.log('error conenctando a mongo: ', error.message)   
    }
}