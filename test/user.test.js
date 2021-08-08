const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne,userOneId,userTwo,userTwoId, setUpdatabse } = require('./fixtures/db')

beforeEach(setUpdatabse)

test('should sign in a new user', async ()=>{
       const response = await request(app).post('/users').send({
        name:"Balogun jamiu",
        password: 'oladipupo1234',
        age: 24,
        email: 'oladipupoj2020@gmail.com'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user:{
            name:"Balogun jamiu",
            age:24,
            email:'oladipupoj2020@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('balogun1234')
})
 test('user should log in', async ()=>{
     await request(app).post('/users/login').send({
         email: userTwo.email,
         password: userTwo.password
     }).expect(200)
 })
 test('should not log in unauthenticated user', async ()=>{
     await request(app).post('/users/login').send({
         email:userOne.email,
         password:userTwo.password
     }).expect(200)
})
 test('should get profile ', async ()=>{
     await request(app)
    .get('/user/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})
  test('should not get profile for non unauthenticated User', async()=>{
      await request(app).get('/user/me').send().expect(401)
  })
test('should delete an account for user', async()=>{
    await request(app)
    .delete('/user/me')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)
})
 test('should not delete an authorized account', async ()=>{
     await request(app).delete('/user/me').send().expect(401)
 })
 test('should update an authenticated user account', async()=>{
     await request(app)
     .patch('/user/me')
     .set('Authorization',  `Bearer ${userTwo.tokens[0].token}`)
     .send({
         name: "jamiu",
         password: "oladipupo1234"
     }).expect(200)
     const user = await User.findById(userTwoId)
     expect(user.name).toBe('jamiu')
 })
 test("should not update an unauthenticated user", async () =>{
     await request(app).patch('/user/me').send({
         name:"Balogun jamiu"
     }).expect(401)
    })
    test('should logout an authorized user', async () =>{
        await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
    })
    test('should not log out an unauthorized user', async()=>{
        await request(app).post('/users/logout').send()
        .expect(401)
    })
    test('should be able to log out all authorized user', async()=>{
        await request(app)
        .post('/users/logoutAll/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    })
    test('should not logout all unauthorized user', async()=>{
        request(app).post('/users/logoutAll/').send()
        .expect(401)
    })
    test('should be able to upload profile picture', async()=>{
        request(app)
        .post('/user/me/avatar')
        .set('Authorization', `Bearer${userOne.tokens[0].token}`)
        .attach('Avatar', 'test/fixtures/profile-pic.jpg')
        .expect(200)
    })
