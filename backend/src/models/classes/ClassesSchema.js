import mongoose from 'mongoose'

const DEFAULT_CLASS_IMAGE_URL = 'https://images.prismic.io/zumba/pGgkTzeVOQlQbs71_Zumba%C2%AEstepsmall.jpg?auto=format,compress'

const ClassesSchema = new mongoose.Schema(
  {
    title: {type: String,required: true,trim: true},
    program: {type: mongoose.Schema.Types.ObjectId,ref: 'Programs',required: true},
    trainer: {type: mongoose.Schema.Types.ObjectId,ref: 'Users',required: true},
    level: {type: String,required: true,enum: ['Principiante', 'Intermedio', 'Avanzado']},
    duration: {type: Number,required: true,default: 45,min: 1},
    image: {type: String,default: DEFAULT_CLASS_IMAGE_URL},
    imagePublicId: {type: String, default: ''}
  },
  {
    timestamps: true
  }
)

const Classes = mongoose.model('Classes', ClassesSchema)

export default Classes
