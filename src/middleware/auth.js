const User = require("../models/user")

const auth = async (req, res, next) => {

    if (!req.headers.authorization) return res.status(401).send('Unathorized Request')

    const token = req.headers.authorization.replace('Bearer ', '')

    if (!token) return res.status(401).send('Unathorized Request')

    const user = await User.verify(token)

    if (!user) return res.status(401).send('Unathorized Request')

    req.token = token
    req.user = user
    next()
}

module.exports = auth