const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
    owner:{
        type: String,
        trim: true
    },
    text:{
        type: String,
        trim:true,
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }
},{
    timestamps:true
})

commentSchema.virtual('posts', {
    ref:'Post',
    localField:'_id',
    foreignField:'comments'
})

const comment = mongoose.model('Comment', commentSchema)
module.exports = comment