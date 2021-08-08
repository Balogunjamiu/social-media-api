const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Post = require('../../src/models/post')
const User = require('../../src/models/user')
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id:userOneId,
    name: 'Balogunjamiu',
    password:'oladipupo1234',
    age:21,
    email: 'balogunjamiu40@gmail.com',
    tokens:[{
        token:jwt.sign({_id:userOneId}, process.env.JWT_SECRET)
    }]
}
const  userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Balogunjamiu',
    password:'oladipupo1234',
    age: 21,
    email: 'oladipupojamiu93@gmail.com',
    tokens: [{
        token: jwt.sign({_id:userTwoId}, process.env.JWT_SECRET)
    }]
}
individualPostOne = { 
    _id: new mongoose.Types.ObjectId(),
    name: 'This is a great post',
    owner: userOneId     
}
individualPostTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: 'This is my second post',
    owner: userTwoId
}
const setUpdatabse = async ()=>{
    await User.deleteMany()
    await Post.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Post(individualPostOne).save()
    await new Post(individualPostTwo).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    individualPostOne,
    individualPostTwo,
    setUpdatabse
}