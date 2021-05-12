const express = require("express")
const router = new express.Router();
const Task = require("../models/task")
const auth = require("../middleware/auth")

router.post("/tasks", auth, async (req, res) => {
    //const task = new Task(req.body)
   
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        const result = await task.save()
        result.populate('owner').execPopulate()
        res.status(201).send(result)
    } catch(e) {
        res.status(400).send(e)
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1: 1
    }

    try {
        //const result = await Task.find({"owner": req.user._id})
        //res.status(200).send(result)

        //Alternative
        // await req.user.populate('tasks').execPopulate()
        await req.user.populate({
            path: 'tasks',
            match, 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch(e){
        res.status(500).send()
    }
})

router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id

    try {
        const result = await Task.findOne({ _id, "owner": req.user._id})

        if (!result){
            return res.status(404).send()
        }
        res.status(200).send(result)
    } catch {
        res.status(500).send()
    }

})

router.patch("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    var isAllowedUpdate = false

    isAllowedUpdate = updates.every((update) => allowedUpdates.includes(update))

    console.log('isAllowedUpdate', isAllowedUpdate);

    if (!isAllowedUpdate || updates.length < 1) return res.status(404).send() 

    try{
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id, "owner": req.user._id})

        if (!task) return res.status(404).send()

        updates.forEach((update) => task[update] = req.body[update])
        await task.save();
        //const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})

        res.status(200).send(task)
    } catch (e) {
        console.log(e);
        res.status(400).send()
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id
    
    try {
        //const result = await Task.findByIdAndDelete(_id)

        const result = await Task.findOneAndDelete({_id, "owner": req.user._id})
        
        if (!result) return res.status(404).send()

        res.status(200).send()
    } catch(e) {
        res.status(400).send()
    }
})

module.exports = router