import mongoose from 'mongoose'

const ProgramsSchema = new mongoose.Schema(
  {
    name: {type: String,required: true,trim: true,unique: true},
    description: {type: String,required: true,trim: true},
    image: {type: String,default: ''}    
  },
  {
    timestamps: true
  }
)

const Programs = mongoose.model('Programs', ProgramsSchema)

export default Programs