const mongoose = require('mongoose')
const Comment = require('./comment')
const postSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    picture:{
        type:Buffer
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
         required:true,
        ref: 'User'
    },
    comments:[{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Comment'
    }]
    },{
    timestamps: true
    })
    
// postSchema.methods.saveComment = async function(comment){
//     const post = this
//     const posts = await post.comments.push(comment)
//      await posts.save()
//     return posts    
// }
const posts = mongoose.model('Post', postSchema)

module.exports = posts