import mongoose from "mongoose";

interface IUser {
  userId: string;
  userName?: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  userId: { type: String, required: true },
  userName: { type: String, required: false },
});

export const User = mongoose.model<IUser>("User", UserSchema, "users");
