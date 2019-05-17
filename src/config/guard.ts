import { NextFunction, Request, Response } from "express";
import User from "../models/User";

export let isLogin = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    console.log(req.user ? "guard.ts isLogin => next()" : "guard.ts isLogin => /intro");
    if (req.user) next();
    else return res.redirect("/intro");
};

export let isFill = async (req: Request, res: Response, next: NextFunction) => {
    console.log("I'm here");
    try {
        let user = await User.findOne({ "auth.googleId": req.user.auth.googleId });

        if (!user) {
            user = new User(req.user);
            user = await user.save();
            res.redirect("guard.ts isfill => /");
        }
        req.logIn(user, (err) => {
            if (err) { console.log(err.message); }
            if (user.code === undefined || user.faculty === undefined || user.fullName === undefined || user.phone === undefined || user.avatar === undefined || user.avatar.set === undefined) {
                console.log("guard.ts isfill => /info");
                return res.redirect("/info");
            }
            else {
                console.log("guard.ts isfill => next()");
                next();
            }
        });
    }
    catch (err) {
        console.log(err.message);
    }

};