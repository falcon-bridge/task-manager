const express = require("express");

const Task = require("../models/task");

const auth = require("../middleware/auth");

const router = new express.Router();

// router.post("/tasks", (req, res) => {
//   const task = new Task(req.body);
//   task
//     .save()
//     .then(() => {
//       res.status(201).send(task);
//     })
//     .catch((error) => {
//       res.status(400).send(error);
//     });
// });

// router.post("/tasks", async (req, res) => {
//   const task = new Task(req.body);
//   try {
//     await task.save();
//     res.status(201).send(task);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({ ...req.body, owner: req.user._id });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.get("/tasks", (req, res) => {
//   Task.find({})
//     .then((tasks) => {
//       res.send(tasks);
//     })
//     .catch((error) => {
//       res.status(500).send();
//     });
// });

// router.get("/tasks", async (req, res) => {
//   try {
//     const tasks = await Task.find({});
//     res.send(tasks);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

//GET /tskd?completed=true
//GET /tskd?limit=10&skip=20
//GET /tskd?sortBy=createdAt:sesc

router.get("/tasks", auth, async (req, res) => {
  //if query isn't provided, it should fetch all task
  const findParameter = { owner: req.user._id };

  //the query field will be a string and not a boolean value
  if (req.query.completed) {
    const val = req.query.completed === "true";
    findParameter.completed = val;
  }

  const sortParameter = {};

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sortParameter[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    // const tasks = await Task.find(findParameter)
    const tasks = await Task.find(findParameter)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort(sortParameter);
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

// router.get("/tasks", auth, async (req, res) => {
//   const match = {};
//   const sort = {};

//   if (req.query.completed) {
//     match.completed = req.query.completed === "true";
//   }

// if (req.query.sortBy) {
//   const parts = req.query.sortBy.split(":");
//   sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
// }

//   try {
//     // const tasks = await Task.find({ owner: req.user._id });
//     // await req.user.populate("tasks").execPopulate();
//     await req.user
//       .populate({
//         path: "tasks",
//         match,
//         options: {
//           limit: parseInt(req.query.limit),
//           skip: parseInt(req.query.skip),
//           sort,
//         },
//       })
//       .execPopulate();
//     res.send(req.user.tasks);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// router.get("/tasks/:id", (req, res) => {
//   const _id = req.params.id;

//   Task.findById(_id)
//     .then((task) => {
//       if (!task) {
//         return res.status(404).send();
//       }
//       res.send(task);
//     })
//     .catch((error) => {
//       res.status(500).send();
//     });
// });

// router.get("/tasks/:id", async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const task = await Task.findById(_id);
//     if (!task) {
//       return res.status(404).send();
//     }
//     res.send(task);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// router.patch("/tasks/:id", async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["description", "completed"];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid updates" });
//   }

//   try {
//     // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
//     //   new: true,
//     //   runValidators: true,
//     // });

//     const task = await Task.findById(req.params.id);

//     updates.forEach((update) => (task[update] = req.body[update]));

//     await task.save();

//     if (!task) {
//       return res.status(404).send();
//     }

//     res.send(task);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    // const task = await Task.findOne(req.params.id);
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.delete("/tasks/:id", async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);

//     if (!task) {
//       return res.status(404).send();
//     }

//     res.send(task);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
