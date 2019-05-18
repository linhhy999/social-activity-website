import { Request, Response } from "express";
import Activity from "../models/Activity";
import User from "../models/User";
import Avatar from "../models/Avatar";
import { NextFunction } from "connect";


/**
 * GET /
 * Home page.
 */
export let getUser = (req: Request, res: Response) => {
    // todo
};

export let postUser = (req: Request, res: Response) => {
    // todo
};

export let updateUserInfo = (req: Request, res: Response) => {
    // todo
};

export let blockUser = (req: Request, res: Response) => {
    // todo
};

export let unBlockUser = (req: Request, res: Response) => {
    // todo
};

export let changeRole = (req: Request, res: Response) => {
    // todo
};

export let profile = async (req: Request, res: Response) => {
    const activity = await Activity.find({ "members.mssv": req.user.code });
    return res.render("profile", {
        user: req.user,
        activity: activity
    });
};
export let info = (req: Request, res: Response) => {
    return res.render("fill", {
        user: req.user
    });
};

export let postInfo = async (req: any, res: any) => {
    req.checkBody("mssv", "MSSV không được để trống").notEmpty();
    req.checkBody("phone", "Số điện thoại không được để trống").notEmpty();
    req.checkBody("faculty", "Tên khoa không được để trống").notEmpty();
    req.checkBody("name", "Tên không được để trống").notEmpty();
    req.checkBody("socialday", "Tên không được để trống").notEmpty();
    // req.checkBody("avatar", "Tên không được để trống").notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }
    let avatarlink = "";
    if (req.body.avatar) {
        const avatar = new Avatar({ "data": req.body.avatar });
        avatar.save((err) => {
            console.log(err);
            return res.redirect("back");
        });
        avatarlink = "/" + avatar._id;
    }
    else avatarlink = req.user.auth[0].picture;

    const user = await User.findOne({ "_id": req.user._id });
    try {
        await User.updateOne({ "_id": req.user._id }, {
            $set: {
                "code": req.body.mssv,
                "phone": req.body.phone,
                "faculty": req.body.faculty,
                "fullName": req.body.name,
                "avatar": avatarlink,
                "socialday": req.body.socialday
            }
        }, { upsert: false });
        return res.redirect("/");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }

};

export let updateProfile = async (req: any, res: Response, next: NextFunction) => {
    req.checkBody("mssv", "MSSV không được để trống").notEmpty();
    req.checkBody("phone", "Số điện thoại không được để trống").notEmpty();
    req.checkBody("faculty", "Tên khoa không được để trống").notEmpty();
    req.checkBody("name", "Tên không được để trống").notEmpty();
    req.checkBody("socialday", "Tên không được để trống").notEmpty();
    // req.checkBody("avatar", "Tên không được để trống").notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }
    let avatarlink = "";
    if (req.body.avatar) {
        const avatar = new Avatar({ "data": req.body.avatar });
        avatar.save((err) => {
            console.log(err);
            return res.redirect("back");
        });
        avatarlink = "/" + avatar._id;
    }
    else avatarlink = req.user.auth[0].picture;

    const user = await User.findOne({ "_id": req.user._id });
    try {
        await User.updateOne({ "_id": req.user._id }, {
            $set: {
                "code": req.body.mssv,
                "phone": req.body.phone,
                "faculty": req.body.faculty,
                "fullName": req.body.name,
                "avatar": avatarlink,
                "socialday": req.body.socialday
            }
        }, { upsert: false });
        res.redirect(req.get("referer"));
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }
};
