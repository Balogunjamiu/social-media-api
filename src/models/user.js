const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Post = require('./post')

const userSchema = new  mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true
    },
    password:{
        type : String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('password cannot be used as the password')
            }
        }

    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error ('Email is invalid')
            }
        }
    },
    age:{
        type : Number,
        default: 0,
        validate(value){
            if (value< 0){
                throw new Error('Age must be a positive number')
            }
        }

    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
     avatar:{
         type:Buffer
     }
},{
    timestamps:true    
})
userSchema.virtual('posts', {
    ref:'Post',
    localField:'_id',
    foreignField:'owner'
})
    userSchema.methods.generateAuthToken = async function (){
    const user = this 
    const token = jwt.sign({_id:user._id.toString()},'oladipupojamiu1234')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
    userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})
    if (!user){
        throw new Error ('unable to login')         
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error ('unable to login')      
    }
    return user
}

 userSchema.pre("save", async function(next){
     const user = this
    // console.log("just before saving")
     if (user.isModified('password')){
         user.password = await bcrypt.hash(user.password,8)
     }
     next()
})
 userSchema.pre('remove', async function (next){
     const user = this
     await Post.deleteMany({owner:user._id})
    next()
 })

 


const User = mongoose.model('User',userSchema)

module.exports = User