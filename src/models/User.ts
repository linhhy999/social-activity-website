import mongoose from "mongoose";

export type UserModel = mongoose.Document & {
    auth: any[],
    email: string,
    phone: string,
    code: string,
    role: Role,
    fullName: string,
    numWorkDay: number,
    faculty: string,
    isBlock: boolean
};

export enum Role {
    Admin = 1,
    Student = 5,
    Host = 10
}



const userSchema = new mongoose.Schema({
    auth: [],
    email: String,
    phone: String,
    code: String,
    role: Number,
    fullName: String,
    numWorkDay: Number,
    faculty: String,
    isBlock: Boolean
}, { timestamps: true });


// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model<UserModel>("User", userSchema);
export default User;