import mongoose from "mongoose";

const WorkoutSessionSchema = new mongoose.Schema({
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
        class: {type:mongoose.Schema.Types.ObjectId, ref: 'Classes', required: true },
        completedTracks:[{type:mongoose.Schema.Types.ObjectId, ref: 'Tracks', required: true }],
        completed: {type:Boolean, default: false },
        completedAt:{type:Date, default:null}
},{
    timestamps: true,
})

const WorkoutSessions = mongoose.model('WorkoutSessions', WorkoutSessionSchema)

export default WorkoutSessions
