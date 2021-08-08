const app = require('./app')

 const port = process.env.PORT

app.listen(port, ()=>{
    console.log('the app is runnning on port ' + port)
})
