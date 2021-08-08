const path = require('path')
const hbs = require('hbs')
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const postRouter = require('./routers/posts')

const app = express()

const publicDirectoriesPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)
app.use(express.static(publicDirectoriesPath))
app.use(express.json())
app.use(userRouter)
app.use(postRouter)

app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/register', (req, res)=>{
    res.render('register')
})

// const jwt = require('jsonwebtoken')

// const myFunction = async ()=>{
//     const token = jwt.sign({_id: '6074ad54dea5c30c04eb2cd0'}, 'balogunjamiu')
//     //console.log(token)
// }
// myFunction()

// app.listen(port, ()=>{
//     console.log('the app is runnning on port ' + port)
// })
module.exports = app
