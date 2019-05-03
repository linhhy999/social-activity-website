import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";
import { type } from "os";

export type UserModel = mongoose.Document & {
    name: string,
    registerEnd: Date,
    timeStart: Date,
    timeEnd: Date,
    location: string,
    numWorkDay: number,
    description: string,
    content: string,
    orgUnit: string,
    hostName: string,
    image: string[],
    video: string[],
    maxMember: number,
    members: []
    comment: Comment[],
    superVisor: []
};

export type Comment = {
    userId: mongoose.Types.ObjectId,
    timeComment: Date,
    content: string
    reply: Comment[]
};



const userSchema = new mongoose.Schema({

}, { timestamps: true });


// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model("User", userSchema);
export default User;