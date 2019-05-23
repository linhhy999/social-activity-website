import mongoose from "mongoose";
import { ObjectId } from "bson";

export type UserModel = mongoose.Document & {
    auth: any[],
    notifications: Notification[],
    email: string,
    phone: string,
    code: string,
    role: Role,
    fullName: string,
    faculty: string,
    isBlocked: boolean,
    avatar: string
    socialdays: {
        value: number,
        lastUpdate: number
    }
};

const userSchema = new mongoose.Schema({
    auth: [],
    notifications: [],
    email: String,
    phone: String,
    code: String,
    role: Number,
    fullName: String,
    faculty: String,
    isBlocked: Boolean,
    avatar: String,
    socialdays: {
        value: Number,
        lastUpdate: Number
    }
}, { timestamps: true });

export enum Role {
    Admin = 1,
    Student = 5,
    Host = 10
}

export type Notification = {
    image: string,
    title: string,
    time: Date,
    content: string,
    link: string;
};


// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model<UserModel>("User", userSchema);
export default User;