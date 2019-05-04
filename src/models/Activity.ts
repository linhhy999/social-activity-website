import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";
import { type } from "os";

export type ActivityModel = mongoose.Document & {
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
    members: any[]
    comment: Comment[],
    superVisor: []
};

export type Comment = {
    userId: mongoose.Types.ObjectId,
    timeComment: Date,
    content: string
    reply: Comment[]
};



const activitySchema = new mongoose.Schema({
    name: String,
    registerEnd: Date,
    timeStart: Date,
    timeEnd: Date,
    location: String,
    numWorkDay: Number,
    description: String,
    content: String,
    orgUnit: String,
    hostName: String,
    image: [],
    video: [],
    maxMember: Number,
    members: [],
    comment: [],
    superVisor: []
}, { timestamps: true });


// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const Activity = mongoose.model<ActivityModel>("Activity", activitySchema);
export default Activity;