import mongoose, { Schema, models } from "mongoose";

// interface IUser extends Document {
//   firstname: string;
//   lastname?: string;
//   email: string;
//   password?: string;
//   otp?: string;
//   otpExpiresAt?: Date;
//   isVerified: boolean;
//   isGoogleUser: boolean;
// }

const userSchema = new Schema(
  {
    firstname: { type: String, required: true},
    lastname: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    otp: { type: String, required: false },
    otpExpiresAt: { type: Date, required: false },
    isVerified: {type: Boolean, default: false},
    isGoogleUser: {type: Boolean, default: false}
  },
  { timestamps: true }
);

userSchema.pre("validate", function (next) {
  if (this.isGoogleUser) {
    this.password = undefined; // Remove password field for Google users
  }
  next();
});

// Prevent model overwrite error
const User = models.User || mongoose.model("User", userSchema);

export default User;
