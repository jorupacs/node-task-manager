const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, invalidToken, userOneId, setUpDatabase} = require('./fixtures/db')


beforeEach(setUpDatabase)

test('Should signup a new user', async () => {

    userObj = {
        name: 'Jill Pascual',
        email: 'jill@xyz.com',
        password: 'testingme'
    }
    const res = await request(app).post('/users').send(userObj).expect(201)

    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()

    //Assertion response
    expect(res.body).toMatchObject({
        user: {
            name: userObj.name,
            email: userObj.email
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe(userObj.password)
})

test('Should login an existing user', async () => {
    const res = await request(app).post('/users/login').send({
        email: userOne.email, 
        password: userOne.password
    }).expect(200)

    const user = await User.findById(res.body.user._id)
    expect(user.tokens[1].token).toBe(res.body.token)
})

test('Should not login an incorrect password', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'incorrect123'
    }).expect(404)
})

test('Should not login an invalid email', async () => {
    await request(app).post('/users/login').send({
        email: 'invalid@xyz.com',
        password: userOne.password
    }).expect(404)
})

test('Should get profile of user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for invalid token', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send()
        .expect(401)
})

test('Should not get profile for no authentication', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete a user', async () => {
    const res = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should delete an authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})