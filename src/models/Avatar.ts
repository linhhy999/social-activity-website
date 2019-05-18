import mongoose from "mongoose";
import { ObjectId } from "bson";

export type AvatarModel = mongoose.Document & {
    data: any,
};

const userSchema = new mongoose.Schema({
    data: Buffer,
}, { timestamps: true });

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model<AvatarModel>("Avatar", userSchema);
export default User;