const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

const User = require("../models/User");

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};
router.post("/user/signup", fileUpload(), async (req, res) => {
  console.log(req.body);

  try {
    if (
      !req.body.email ||
      !req.body.username ||
      !req.body.password ||
      req.body.newsletter === undefined
    ) {
      return res.status(400).json({ message: "The element missing" });
    }

    if (await User.findOne({ email: req.body.email })) {
      return res.status(409).json({ message: "This mail has already used" });
    }
    const password = req.body.password;
    const salt = uid2(16);
    const hash = SHA256(salt + password).toString(encBase64);
    const token = uid2(64);

    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
      },
      newsletter: req.body.newsletter,
      token: token,
      hash: hash,
      salt: salt,
    });

    if (req.files?.picture) {
      const pictureToAvatar = convertToBase64(req.files.picture);

      const resultAvatar = await cloudinary.uploader.upload(pictureToAvatar, {
        folder: `/users${newUser._id}`,
      });

      newUser.account.avatar = resultAvatar;
    }

    await newUser.save();

    const response = {
      id: newUser._id,
      token: token,
      account: newUser.account,
    };
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "The element missing" });
    }
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const userPassword = req.body.password;

      const userSalt = user.salt;

      userHash = SHA256(userSalt + userPassword).toString(encBase64);

      if (userHash !== user.hash) {
        return res
          .status(401)
          .json({ message: "The email or password isn't correct" });
      }

      const responseUser = {
        id: user._id,
        token: user.token,
        account: user.account,
      };
      res.json(responseUser);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
