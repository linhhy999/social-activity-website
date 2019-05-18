import mongoose from "mongoose";

export type ActivityModel = mongoose.Document & {
    name: string,
    registerEnd: string,
    dateStart: string,
    dateEnd: string,
    timeStart: string,
    timeEnd: string,
    gatheringPlace: string,
    targetPlace: number,
    content: string,
    orgUnit: string,
    host: {},
    image: Media[],
    video: Media[],
    maxMember: number,
    members: Member[],
    comment: Comment[],
    superVisor: [],
    benefit: number,
    status: boolean
};

export type Comment = {
    userId: mongoose.Types.ObjectId,
    timeComment: Date,
    content: string
    reply: Comment[]
};

export type Media = {
    id: string,
    link: string
};
export type Member = {
    mssv: string,
    name: string,
    faculty: string,
    phone: string,
    email: string,
    status: Status
};

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
    timeStart: String,
    timeEnd: String,
    gatheringPlace: String,
    targetPlace: String,
    content: String,
    orgUnit: String,
    benefit: Number,
    host: {},
    image: [],
    video: [],
    maxMember: Number,
    members: [],
    comment: [],
    superVisor: [],
    status: Boolean
}, { timestamps: true });


// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const Activity = mongoose.model<ActivityModel>("Activity", activitySchema);
export default Activity;