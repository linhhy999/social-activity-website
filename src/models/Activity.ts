import mongoose from "mongoose";
import User from "./User";
export type ActivityModel = mongoose.Document & {
    name: string,
    registerEnd: string,
    dateStart: string,
    dateEnd: string,
    gatheringPlace: string,
    targetPlace: number,
    content: string,
    orgUnit: string,
    host: any,
    images: string[],
    maxMember: number,
    members: Member[],
    comment: Comment[],
    superVisor: [],
    benefit: number,
    status: boolean,
    ctxh: CTXH,
};

export type CTXH = {
    value: number,
    lastUpdate: Date,
};

export type Comment = {
    fullName: string,
    userAvatar: string,
    timeComment: Date,
    content: string
    reply: Comment[]
};

export type Member = {
    info: any,
    status: Status,
    isJoined: Join,
    point: number,
    note: string,
};

export enum Join {
    "JOINED" = 1,
    "ABSENT" = 2,
    "ABSENT_WITH_PERMISSION" = 3,
    "WAITING" = 4
}

export enum Status {
    PENDING = 1,
    ACCEPT = 2,
    REFUSE = 3
}


const activitySchema = new mongoose.Schema({
    name: String,
    registerEnd: String,
    dateStart: String,
    dateEnd: String,
    gatheringPlace: String,
    targetPlace: String,
    content: String,
    orgUnit: String,
    benefit: Number,
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        autopopulate: true
    },
    images: [String],
    maxMember: Number,
    members: [{
        info: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            autopopulate: true
        },
        status: Number,
        isJoined: Number,
        point: Number,
        note: String,
    }],
    comment: [],
    superVisor: [],
    status: Boolean,
    isJoined: Number,
    ctxh: {
        value: Number,
        lastUpdate: Date
    }

}, { timestamps: true });

activitySchema.plugin(require("mongoose-autopopulate"));

const Activity = mongoose.model<ActivityModel>("Activity", activitySchema);
export default Activity;