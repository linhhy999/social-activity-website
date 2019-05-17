import { NextFunction, Request, Response } from "express";
import Activity from "../models/Activity";
import User from "../models/User";

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
    console.log(req.user);
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

            return res.render("newsfeed", {
                user: req.user,
                activities: activityList,
                orgUnit: a
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
            console.log("home.ts => res.redirect('/')");
            res.redirect("/");
        }
        req.logIn(user, (err) => {
            if (err) console.log(err.message);
            if (user.code == undefined) {
                console.log("home.ts => res.redirect('/info')");
                return res.redirect("/info");
            }
            else {
                console.log("req.user:");
                console.log(req.user);
                console.log('home.ts2 => res.redirect("/")');
                return res.redirect("/");
            }
        });
    }
    catch (err) { console.log(err.message); }

};

export let logout = async (req: Request, res: Response) => {
    req.logout();
    return res.redirect("/");
};