const User = require("../models/User");

const isAuthentificated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");

    const user = await User.findOne({ token }).select("account");
    //  username: req.body.username,
    //  password: req.body.password,
    // token: token,
    //};

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = isAuthentificated;
