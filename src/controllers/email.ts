const mail = require("../util/email");
import { NextFunction, Request, Response } from "express";
let i = 0;

export let registered = async (req: Request, res: Response, next: NextFunction) => {
    mail.registered(res.locals.user.fullName, res.locals.user.email, res.locals.activity.name);
    console.log("Sending " + ++i + " mail(s) to " + res.locals.user.fullName + " " + res.locals.user.email + " " + res.locals.activity.name);
    return res.redirect("back");
};