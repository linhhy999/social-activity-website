import { Request, Response } from "express";
import * as passportConfig from "../config/passport";
import { NextFunction } from "express";
import User, { Role } from "../models/User";
import Activity from "../models/Activity";

/**
 * GET /
 * Home page.
 */

export let intro = async (req: Request, res: Response) => {
    res.render("index", {
        user: req.user
    });
};
export let index = async (req: Request, res: Response) => {
    if (req.user) {
        try {
            const activityList = await Activity.find().limit(10);
            const unit = await Activity.find({}, { orgUnit: 1, _id: 0 });
            const a = [], b = [];
            let prev;
            unit.sort();
            for (let i = 0; i < unit.length; i++) {
                if (unit[i].orgUnit !== prev) {
                    a.push({ orgUnit: unit[i].orgUnit });
                    b.push({ num: 1 });
                } else {
                    b[b.length - 1].num++;
                }
                prev = unit[i].orgUnit;
            }
            for (let i = 0; i < a.length; i++) {
                a[i] = { ...a[i], ...b[i] };
            }
            const activity = await Activity.find({ "members.mssv": req.user.code });
            return res.render("newsfeed", {
                user: req.user,
                activities: activityList.reverse(), 
                orgUnit: a,
                userActivities: activity
            });
        }
        catch (err) {
            console.log(err.message);
        }
    }
    else {
        return res.redirect("/intro");
    }

};

export let admin = async (req: Request, res: Response) => {
    res.render("admin/index", {});
};

export let login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let user = await User.findOne({ "auth.googleId": req.user.auth.googleId });

        if (!user) {
            user = new User(req.user);
            user = await user.save();
            res.redirect("/");
        }
        req.logIn(user, (err) => {
            if (err)
                console.log(err.message);
            if (user.fullName == undefined) return res.redirect("/info");
            else if (user.role == Role.Admin || user.role == Role.Host) return res.redirect("/admin");
            else return res.redirect("/");
        });
    }
    catch (err) { console.log(err.message); }
};

export let logout = async (req: Request, res: Response) => {
    req.logout();
    return res.redirect("/");
};