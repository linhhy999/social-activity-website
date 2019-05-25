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
            const a: any[] = [];
            unit.sort();
            for (let i = 0; i < unit.length; i++) {
                let meet: boolean = false;
                for (let j = a.length; j > 0; j--) {
                    if (unit[i].orgUnit == a[j - 1].orgUnit) {
                        a[j - 1].num++;
                        meet = true;
                        break;
                    }
                }
                if (!meet) a.push({ orgUnit: unit[i].orgUnit, num: 1 });
            }
            const activity = await Activity.find({ "members.info.code": req.user.code });
            return res.render("newsfeed", {
                user: req.user,
                activities: activityList.reverse(),
                orgUnit: a,
                userActivities: activity,
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
            if (err) console.log(err.message);
            // if (user.fullName == undefined) return res.redirect("/info");
            if (user.role == Role.Admin || user.role == Role.Host) return res.redirect("/admin");
            else return res.redirect("/");
        });
    }
    catch (err) { console.log(err.message); }
};

export let logout = async (req: Request, res: Response) => {
    req.logout();
    return res.redirect("/");
};