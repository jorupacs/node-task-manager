const express = require("express");
require("./db/mongoose")
const routerUser = require("./routers/user")
const routerTask = require("./routers/task");

const app = express();

app.use(express.json()) // parse incoming JSON
app.use(routerUser)
app.use(routerTask)



module.exports = app