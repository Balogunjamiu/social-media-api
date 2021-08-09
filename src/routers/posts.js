const express = require('express')
const Post = require('../models/post')
const Comment = require('../models/comment')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

router.post('/posts', auth, async  (req,res)=>{
    const post = new Post({
        ...req.body,
        owner:req.user._id
    })
    try{
        await post.save()
        res.status(201).send(post)
    }catch(e){
        res.send(400).send(e)
    }
})

router.get('/posts',auth, async(req,res)=>{
    try{
        const post = await Post.find({})
        res.send(post)
    }catch(e){
        res.status(500).send(e)
    }
})
router.get('/privatePosts', auth, async(req,res)=>{
    try{
        const post = await Post.find({owner: req.user.id})
        res.send(post)

    }catch(e){
        res.status(500).send(e)
    }
})
router.get('/posts/:id',auth, async (req,res)=>{
    const _id = req.params.id
    try{
        const post = await Post.findById({_id, owner:req.user._id})
        res.send(post)
        if(!post){
            return res.status(404).send()
        }
    }catch(e){
        res.status(400).send(e)
    }
})
router.post('/posts/:id/comment', auth, async (req,res)=>{
     const _id = req.params.id
     const comment = new Comment({ 
         text:req.body.text,
         owner:req.body.owner,
         post:_id
     })
     try{
         await comment.save()
         const post = await Post.findById({_id})
          await post.comments.push(comment)   
          post.save()
          res.send(post.comments)
         //await saveComment.save()
        // comments = await post.saveComment(comment)
        // res.send(comments)
       //await post.saveComment(comment)
    }catch(e){
        res.status(500).send(e)
    }    
})

router.get('/posts/:id/comments', auth , async (req, res)=>{
     const _id = req.params.id
    try{
        const post = await Post.findById({_id})
        await post.populate('comments').execPopulate()
         res.send(post.comments)
    }catch(e){
        res.status(500).send(e)
    }
})
router.patch('/posts/:id', auth, async (req, res)=>{
    const _id = req.params.id
    const update = Object.keys(req.body)
    allowUpdate = ['name']
    const validate = update.every((updates)=> allowUpdate.includes(updates))
    if(!validate){
        return res.status(400).send({'Error':'invalid update'})
    }
    try{
        const post = await Post.findOne({_id, owner:req.user._id})
        if(!post){
            return res.status(400).send(e)
        }
        update.forEach((updates)=> post[update]= req.body[updates])
        post.save()
        res.send(post)

    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/posts/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try{
        const post = await Post.findOneAndDelete({_id, owner: req.user._id})
        if(!post){
            return res.status(404).send()
        }
        res.send(post)
    }catch(e){
        res.status(500).send()
    }
})
router.delete('/user/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token) 
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.post('/user/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send('logged out all')
    }catch(e){

    }
})
router.delete('/user/me', auth, async (req,res)=>{
    try{
        req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})
const upload = multer({
    limits :{
        fileSize: 1000000
    },
fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
        return cb(new Error('File not supported'))
    }
    cb(undefined, true)
    }
})
router.post('/user/individualPost/:id',auth,upload.single('picture'), async(req,res)=>{
    const _id = req.params.id
    const buffer = await sharp(req.file.buffer).resize({width:250, height:259}).png().toBuffer()
    const post = await Post.findOne({_id, owner:req.user._id})
    console.log(post)
    post.picture = buffer
     await post.save()
      res.send()
},(error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.get('/user/individualPost/:id/', auth ,async (req,res)=>{
    const _id = req.params.id
    try{
        const post = await Post.findById({_id, owner:req.user._id})
        console.log(post)
        if(!post || !post.picture){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(post.picture)
    }catch(e){
        res.status(400).send()
    }
})

module.exports = router