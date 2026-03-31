import mongoose, { Document } from "mongoose";

export interface UserType extends Document {
  name: string;
  email: string;
  password_hash: string;
  role: string;
};

const userSchema = new mongoose.Schema<UserType>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password_hash: {
    type: String, 
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;