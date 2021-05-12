const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    userOne, 
    invalidToken, 
    userOneId, 
    taskOne, 
    taskTwo, 
    taskThree, 
    setUpDatabase, 
    userTwo} = require('./fixtures/db')


beforeEach(setUpDatabase)

test('Should add task when user is authorized', async () => {
    const taskObj = {
        description: "Refreshing node"
    }
    const res = await request(app).post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(taskObj)
        .expect(201)

    const task = await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
    expect(task.owner).toEqual(userOne._id)
})

test('Should note add task when there is no authorization', async () => {
    await request(app).post('/tasks')
        .send({
            description: "Refreshing node"
        })
        .expect(401)
})

test('Should note add task when invalid authorization', async () => {
    await request(app).post('/tasks')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send({
            description: "Refreshing node"
        })
        .expect(401)
})

test('Should return two tasks for userOne', async () => {
    const res = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(res.body.length).toEqual(2)
})

test('Should fail to delete task for userTwo', async () => {
    const res = await request(app).delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
})