import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [
      /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
      "Email is not valid",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [3, "Name must be at least 3 characters"],
    maxLength: [50, "Name must be at most 50 characters"],
  },
  confirmationToken: {
    type: String,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  blocked: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["public", "admin"],
    default: "public",
  },
});
const User = models.User || model("User", userSchema);
export default User;
