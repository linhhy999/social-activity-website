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
    image: string[],
    video: string[],
    maxMember: number,
    members: any[],
    comment: Comment[],
    superVisor: [],
    benefit: number
};

export type Comment = {
    userId: mongoose.Types.ObjectId,
    timeComment: Date,
    content: string
    reply: Comment[]
};



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
    superVisor: []
}, { timestamps: true });


// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const Activity = mongoose.model<ActivityModel>("Activity", activitySchema);
export default Activity;