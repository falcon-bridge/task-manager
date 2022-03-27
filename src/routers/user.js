const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/user");

const auth = require("../middleware/auth");

const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");

const router = new express.Router();

// router.post("/users", (req, res) => {
//   const user = new User(req.body);
//   //   console.log(user);
//   user
//     .save()
//     .then(() => {
//       //   console.log(u);
//       res.status(201).send(user);
//     })
//     .catch((error) => {
//       //   res.status(400);
//       //   res.send(error);
//       res.status(400).send(error);
//     });
// });

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();

    //sending the new user a welcome email
    sendWelcomeEmail(user.email, user.name);

    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// router.get("/users", (req, res) => {
//   User.find({})
//     .then((users) => {
//       res.send(users);
//     })
//     .catch((error) => {
//       res.status(500).send();
//     });
// });

//since any user shouldn't see the details of other users, we will show his details only

router.get("/users/me", auth, async (req, res) => {
  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (e) {
  //   res.status(500).send();
  // }
  res.send(req.user);
});

// router.get("/users/:id", (req, res) => {
//   const _id = req.params.id;

//   User.findById(_id)
//     .then((user) => {
//       if (!user) {
//         return res.status(404).send();
//       }
//       res.send(user);
//     })
//     .catch((error) => {
//       res.status(500).send();
//     });
// });

// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// router.patch("/users/:id", async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["name", "email", "password", "age"];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid Operation" });
//   }

//   try {
//     // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     //   new: true,
//     //   runValidators: true,
//     // });

//     // for middlewares to work properly, we don't use above approah. Instead, we use the following

//     const user = await User.findById(req.params.id);

//     updates.forEach((update) => (user[update] = req.body[update]));

//     await user.save();

//     if (!user) {
//       return res.status(404).send();
//     }

//     res.send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Operation" });
  }

  try {
    const user = req.user;

    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.delete("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).send();
//     }

//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._d);

    // if (!user) {
    //   return res.status(404).send();
    // }

    await req.user.remove();

    //sending the user a cancelation email
    sendCancelationEmail(req.user.email, req.user.name);

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000, // close to 1 mb
  },
  fileFilter(req, file, cb) {
    // // if it is not an image file
    // if (
    //   !(
    //     file.originalname.endsWith(".jpg") ||
    //     file.originalname.endsWith(".jpeg") ||
    //     file.originalname.endsWith(".png")
    //   )
    // ) {
    //   return cb(new Error("Please upload an image file"));
    // }

    //using a regular expression for matching
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image file"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer) //using sharp library to conver any image to pm=ng type and of a fixed dimension
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    // req.user.avatar = req.file.buffer;
    req.user.avatar = buffer;
    await req.user.save();

    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();

  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      return new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
