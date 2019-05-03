import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";

export type UserModel = mongoose.Document & {
    auth: any[],
    email: string,
    phone: string,
    code: string,
    role: Role,
    fullName: string,
    numWorkDay: number,
    faculty: Faculty,
    isBlock: boolean
};


export enum Faculty {
    ELECTRONIC = 1,
    ENGINEERING_CONSTRUCTION = 2,
    FACULTY_OF_MECHANICS = 3,
    DEPARTMENT_OF_CHEMICAL_ENGINEERING = 4,
    SCIENCE_SCIENCE_AND_COMPUTER_ENGINEERING = 5

}

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
    faculty: Number,
    isBlock: Boolean
}, { timestamps: true });


// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model<UserModel>("User", userSchema);
export default User;