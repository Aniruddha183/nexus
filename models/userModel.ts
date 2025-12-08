import mongoose, { Model } from "mongoose";

// Transcript Schema
export interface IUser extends Document {
  USRID: String;
  name: String;
  email: string;
  role: string;
  experience: string;
  difficulty: string;
  language: string;
  questionLimit: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    USRID: { type: String, required: true, unique: true, index: true },
    name: String,
    email: String,
    role: String,
    experience: String,
    difficulty: String,
    language: String,
    questionLimit: { type: Number, default: 5 },
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
