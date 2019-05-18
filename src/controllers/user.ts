import { Request, Response } from "express";
import Activity from "../models/Activity";
import User from "../models/User";
import GeneralInfomation from "../models/General";
import { NextFunction } from "express";


// /**
//  * GET /
//  * Home page.
//  */
// export let getUser = (req: Request, res: Response) => {
//     // todo
// };

// export let postUser = (req: Request, res: Response) => {
//     // todo
// };

// export let updateUserInfo = (req: Request, res: Response) => {
//     // todo
// };

// export let blockUser = (req: Request, res: Response) => {
//     // todo
// };

// export let unBlockUser = (req: Request, res: Response) => {
//     // todo
// };

// export let changeRole = (req: Request, res: Response) => {
//     // todo
// };

export let profile = async (req: Request, res: Response) => {
    const activity = await Activity.find({ "members.mssv": req.user.code });
    const faculties = (await GeneralInfomation.find({}))[0].facultyList;
    return res.render("profile", {
        user: req.user,
        faculties: faculties,
        activity: activity
    });
};
export let info = async (req: Request, res: Response) => {
    const faculties = (await GeneralInfomation.find({}))[0].facultyList;
    return res.render("fill", {
        user: req.user,
        faculties: faculties
    });
};

export let postInfo = async (req: any, res: any) => {
    req.checkBody("mssv", "MSSV không được để trống").notEmpty();
    req.checkBody("phone", "Số điện thoại không được để trống").notEmpty();
    req.checkBody("faculty", "Tên khoa không được để trống").notEmpty();
    req.checkBody("name", "Tên không được để trống").notEmpty();
    req.checkBody("socialday", "Tên không được để trống").notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }
    let avatarlink = "";
    if (req.file) avatarlink = "/uploads/" + req.file.filename;
    else avatarlink = req.user.avatar;

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

    const errors = req.validationErrors();

    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }
    let avatarlink = "";
    if (req.file) avatarlink = "/uploads/" + req.file.filename;
    else avatarlink = req.user.avatar;

    const user = await User.findOne({ "_id": req.user._id });
    const userdata = {
        "code": req.body.mssv,
        "phone": req.body.phone,
        "faculty": req.body.faculty,
        "fullName": req.body.name,
        "avatar": avatarlink,
        "socialday": req.body.socialday
    };
    try {
        await User.updateOne({ "_id": req.user._id }, {
            $set: userdata
        }, { upsert: false });
        res.redirect(req.get("referer"));
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }
};
