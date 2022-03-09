const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
});

// const me = new User({
//   name: "   Aayush     ",
//   email: "KUMAR.RKT2020@GMAIL.COM",
// });

// me.save()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
