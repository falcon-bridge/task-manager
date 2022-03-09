const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
});

const User = mongoose.model("User", {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
});

const me = new User({ name: "Aayush", age: 22 });

me.save()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
