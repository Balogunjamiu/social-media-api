const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')

router.post('/users', async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
       const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})
router.post('/users/login', async (req, res)=>{
    try{
       const user = await User.findByCredentials(req.body.email, req.body.password)
       const token = await user.generateAuthToken()
       res.send({user, token})
    }catch(e){
       res.status(400).send()
    }
})
router.patch('/user/me', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowUpdate = ['name', 'password', 'email', 'age']
    const validate = updates.every((update)=> allowUpdate.includes(update))
    if(!validate){
        return res.status(400).send({'Error':'invalid update'})
    }
    try{
        updates.forEach((update)=> req.user[update]= req.body[update])
        await req.user.save()
        res.send(req.user)

    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token 
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.post('/users/logoutAll/', auth, async(req,res)=>{
    try{
        req.user.token =[]
        await req.user.save()
        res.send('logged out all')
    }catch(e){
        res.send(e)
    }
})
router.get('/user/me/',auth, async(req, res)=>{
    res.send(req.user)

    
})
router.get('/users', auth, async(req,res)=>{
    try{
        users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
})

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error ('The format of the file uploaded is not supported'))
        }
        cb (undefined , true)
    }
})
router.post('/user/me/avatar', auth, upload.single('avatar'), async(req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/user/me/avatar', auth ,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
router.get('/user/:id/avatar', async (req,res)=>{
    try{
       const user = await User.findById(req.params.id)
       if(!user || !user.avatar ){
           throw new Error()
       }
       res.set('Content-Type', 'image/png')
       res.send(user.avatar)
    }catch(e){
        res.status(400).send()
    }
})
router.delete('/user/me', auth , async (req,res)=>{
    try{
        await req.user.remove()
        res.send()
    }catch(e){
        res.send(400)
    }
})
module.exports = router