const express = require("express");
require("./db/mongoose");
const User = require("./models/user");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //automaticall parses the incoming JSON to a JS object

app.post("/users", (req, res) => {
  const user = new User(req.body);
  console.log(user);
  user
    .save()
    .then(() => {
      //   console.log(u);
      res.send(user);
    })
    .catch((error) => {
      res.status(400).send(error);
      //   res.send(error);
    });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
