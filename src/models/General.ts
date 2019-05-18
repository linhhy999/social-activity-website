import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";
import { type } from "os";

export type GeneralModel = mongoose.Document & {
    facultyList: string[]
};




const generalSchema = new mongoose.Schema({
    facultyList: []
}, { timestamps: true });


// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const GeneralInfomation = mongoose.model<GeneralModel>("General", generalSchema);
export default GeneralInfomation;