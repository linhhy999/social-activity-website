import express, { Request, Response } from "express";
import User from "../models/User";
import Activity from "../models/Activity";
import { activityDetail } from "./activity";


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
    // console.log(activity);
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
    req.checkBody("name", "Tên không được để trống").notEmpty();
    req.checkBody("phone", "Số điện thoại không được để trống").notEmpty();
    req.checkBody("mssv", "MSSV không được để trống").notEmpty();
    req.checkBody("faculty", "Tên khoa không được để trống").notEmpty();
    req.checkBody("ctxh", "Số ngày công tác xã hội hiện tại không được để trống").notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }

    await User.updateOne({ "_id": req.user._id }, {
        $set: {
            "fullName": req.body.name,
            "phone": req.body.phone,
            "code": req.body.mssv,
            "faculty": req.body.faculty,
            "numWorkDay": req.body.ctxh
        }
    }, { upset: true });

    return res.redirect("/");
};

export let updateProfile = async (req: any, res: any) => {
    req.checkBody("phone", "Số điện thoại không được để trống").notEmpty();
    req.checkBody("faculty", "Tên khoa không được để trống").notEmpty();
    req.checkBody("name", "Tên không được để trống").notEmpty();
    req.checkBody("email", "Email không được để trống").notEmpty();
    const errors = req.validationErrors();

    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }

    try {
        await User.updateOne({ "_id": req.user._id }, {
            $set: {
                "phone": req.body.phone,
                "faculty": req.body.faculty,
                "fullName": req.body.name,
                "email": req.body.email,
            }
        }, { upsert: false });

        return res.redirect("back");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }
};
