import mongoose from 'mongoose'

const UsersSchema = new mongoose.Schema({
    name: {type: String, required: true, trim:true},
    email: {type: String, required: true,unique:true, lowercase:true, trim:true},
    password:{type: String, required:true,},
    role: {type: String, default: 'client', enum:['client', 'trainer','admin']},
    avatar: {type: String, default:''}
},{
    timestamps:true
})

const Users = mongoose.model('Users', UsersSchema)

export default Users