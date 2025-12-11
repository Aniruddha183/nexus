import mongoose, { Model, Schema } from "mongoose";

// Transcript Schema
export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  USRID: string;
  name: string;
  email: string;
  role: string;
  experience: string;
  difficulty: string;
  language: string;
  // questionLimit: number;
  // currentQuestion: number;
  // durationLimit: number; //In Minutes
  // currentDuration: number; //In Minutes
  userType: "FREE" | "PREMIUM" | "GUEST";
  limits: ILimits;
  googleId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILimits extends Document {
  // daily usage
  dailyQuestionsUsed: number;
  dailyDurationUsed: number;
  dailyInterviewsUsed: number;
  lastResetDate: String; // "2025-01-07"
  // static limits
  maxQuestionsPerDay: number;
  maxDurationPerDay: number;
  maxInterviewsPerDay: number;
}

const LimitsSchema = new mongoose.Schema<ILimits>(
  {
    dailyQuestionsUsed: { type: Number, default: 0 },
    dailyDurationUsed: { type: Number, default: 0 },
    dailyInterviewsUsed: { type: Number, default: 0 },

    maxQuestionsPerDay: { type: Number, default: 5 },
    maxDurationPerDay: { type: Number, default: 10 },
    maxInterviewsPerDay: { type: Number, default: 1 },
    lastResetDate: { type: String },
  },
  {
    _id: false,
  }
);

const UserSchema = new mongoose.Schema<IUser>(
  {
    USRID: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      // required: [true, "Email is required"],
      // unique: true,
    },
    googleId: { type: String },
    userType: {
      type: String,
      enum: ["GUEST", "FREE", "PREMIUM"],
      default: "GUEST",
    },
    role: String,
    experience: String,
    difficulty: String,
    language: String,
    limits: { type: LimitsSchema },
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
