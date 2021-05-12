const express = require("express")
const router = new express.Router();
const User = require("../models/user")
const auth = require("../middleware/auth")


router.post("/users/login", async (req, res) => {

    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(404).send(e) 
    }
})


router.post("/users", async (req, res) => {
    const user = new User(req.body)
   
    try{
        await user.save()
        const token = await user.generateAuthToken()
        return res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get("/users/me", auth, async (req, res) => {

    res.send(req.user)
})

/* router.get("/users/:id", auth, async (req, res) => {
    const _id = req.params.id

    try {
        const result = await User.findById(_id)
        res.send(result)
    } catch (e) {
        res.status(500).send()
    }
}) */

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    var isAllowedUpdate = false

    isAllowedUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isAllowedUpdate || updates.length < 1) return res.status(404).send() 

    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();

        res.status(200).send(req.user)
    } catch (e) {
        console.log(e);
        res.status(400).send()
    }
})

router.delete("/users/me", auth, async (req, res) => {
    const _id = req.user._id
    
    try {
/*         const result = await User.findByIdAndDelete(_id)
        
        if (!result) return res.status(400).send() */

        await req.user.remove()
        res.status(200).send(req.user)
    } catch(e) {
        res.status(400).send()
    }
})

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.status(200).send('Logout Successful')
    } catch (e) {
        res.status(500).send()
    }
})

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.status(200).send('Logout Successful') 
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router