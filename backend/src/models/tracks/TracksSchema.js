import mongoose from 'mongoose'

const TracksSchema = new mongoose.Schema(
  {
    title: {type: String,required: true,trim: true},
    class: {type: mongoose.Schema.Types.ObjectId,ref: 'Classes',required: true},
    trainer: {type: mongoose.Schema.Types.ObjectId,ref: 'Users',required: true},
    order: {type: Number,required: true,min: 1},
    duration: {type: Number,required: true,default: 5},
    videoUrl: {type: String,default: ''},
    focus: {type: String,required: true,trim: true}
  },
  {
    timestamps: true
  }
)

const Tracks = mongoose.model('Tracks', TracksSchema)

export default Tracks