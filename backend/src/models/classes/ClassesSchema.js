import mongoose from 'mongoose'

const ClassesSchema = new mongoose.Schema(
  {
    title: {type: String,required: true,trim: true},
    program: {type: mongoose.Schema.Types.ObjectId,ref: 'Programs',required: true},
    trainer: {type: mongoose.Schema.Types.ObjectId,ref: 'Users',required: true},
    level: {type: String,required: true,enum: ['Principiante', 'Intermedio', 'Avanzado']},
    duration: {type: Number,required: true,default: 45,min: 1},
    image: {type: String,default: ''}
  },
  {
    timestamps: true
  }
)

const Classes = mongoose.model('Classes', ClassesSchema)

export default Classes
