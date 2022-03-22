const User = require("../models/user");

const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "kamandal");
    // console.log(token, decoded);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;

    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate yourself." });
  }
};

module.exports = auth;
