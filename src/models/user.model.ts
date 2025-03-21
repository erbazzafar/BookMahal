import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    firstname: { type: String, required: true},
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String, required: false },
    otpExpiresAt: { type: Date, required: false },
    isVerified: {type: Boolean, default: false}
  },
  { timestamps: true }
);

// Prevent model overwrite error
const User = models.User || mongoose.model("User", userSchema);

export default User;
