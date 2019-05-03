import { Request, Response } from "express";
import * as passportConfig from "../config/passport";
import { NextFunction } from "express";
import User from "../models/User";
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
        const activities = await Activity.find().limit(10);
        return res.render("newsfeed", {
            user: req.user,
            activities: activities
        });
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
        let user = await User.findOne({"auth.0.googleId": req.user.auth.googleId});
        if (!user) {
            user = await new User(req.user);
            user = await user.save();
        }

        req.logIn(user, (err) => {
            if (err) {
                console.log(err.message);
            }
            if (user.fullName == undefined)
                return res.redirect("/info");
            else
                return res.redirect("/");
        });
    }
    catch (err) {
        console.log(err.message);
    }

};

export let logout = async (req: Request, res: Response) => {
    req.logout();
    return res.redirect("/");
};