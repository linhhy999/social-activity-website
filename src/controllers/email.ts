import Activity, { Status } from "../models/Activity";
import User from "../models/User";
const mail = require("../util/email");

import { NextFunction, Request, Response } from "express";
let i = 0;

export let registered = async (req: Request, res: Response, next: NextFunction) => {
    const student = await User.findOne({ "code": res.locals.mssv });
    const activyty = await Activity.findOne({ _id: req.params.activity });
    mail.registered(student.fullName, student.email, activyty.name, req.get("host") + "/activity-detail/" + activyty._id);
    console.log("Sending " + ++i + " mail(s) to " + student.fullName + " " + student.email + " " + activyty.name + " " + req.get("host") + "/activity-detail/" + activyty._id);
    return res.redirect("back");
};