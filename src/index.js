const express = require("express");

require("./db/mongoose");

// const User = require("./models/user");
// const Task = require("./models/task");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
// const port = process.env.PORT || 3000;
const port = process.env.PORT;

app.use(express.json()); //automatically parses the incoming JSON to a JS object

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
