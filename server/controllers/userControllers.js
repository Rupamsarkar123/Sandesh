import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../db/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create a new user instance
  const user = new User({
    name,
    email,
    password,
    pic,
  });

  try {
    // Save the user to trigger the pre-save middleware
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400);
    throw new Error("User creation failed");
  }
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Login Attempt: ", { email, password }); // Debug

  const user = await User.findOne({ email });

  if (user) {
    console.log("User Found: ", user); // Debug
  } else {
    console.log("User Not Found"); // Debug
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});
