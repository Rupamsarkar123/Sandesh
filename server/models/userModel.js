import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  console.log("Pre-save middleware triggered"); // Debug
  if (!this.isModified("password")) {
    console.log("Password not modified, skipping hashing"); // Debug
    return next();
  }
  try {
    console.log("Hashing Password: ", this.password); // Debug
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Hashed Password: ", this.password); // Debug
    next();
  } catch (err) {
    console.error("Error hashing password:", err); // Debug
    next(err); // Pass error to the next middleware
  }
});

const User = mongoose.model("User", userSchema);

export default User;
