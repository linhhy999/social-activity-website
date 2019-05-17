import { NextFunction, Request, Response } from "express";
import User from "../models/User";

export let isLogin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) next();
    else return res.redirect("/intro");
};

export let isFill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let user = await User.findOne({ "auth[0].googleId": req.user.auth.googleId });

        if (!user) {
            user = new User(req.user);
            user = await user.save();
            res.redirect("/");
        }
        req.logIn(user, (err) => {
            if (err) { console.log(err.message); }
            if (user.code === undefined || user.faculty === undefined || user.fullName === undefined || user.phone === undefined || user.avatar === undefined || user.avatar.set === undefined)
                return res.redirect("/info");
            else next();
        });
    }
    catch (err) { console.log(err.message); }
};