import { Request, Response } from "express";
import Activity from "../models/Activity";
import User from "../models/User";
import GeneralInfomation from "../models/General";
import { NextFunction } from "express";

export let profile = async (req: Request, res: Response) => {
    if (req.query.code == undefined || req.query.code == req.user.code) {
        const activity = await Activity.find({ members: { $elemMatch: { "info.code": req.user.code } } });
        const faculties = (await GeneralInfomation.find({}))[0].facultyList;
        return res.render("profile", {
            user: req.user,
            faculties: faculties,
            activity: activity,
            validmssv: getValidMSSV(req.user.fullName)
        });
    }
    else {
        const mssv = req.query.code;
        const user = await User.findOne({ "code": mssv });
        if (user == undefined) {
            return res.render("404");
        }
        let userinfo = {
            fullName: user.fullName,
            code: user.code,
            falcuty: user.faculty,
            avatar: user.avatar,
            role: user.role,
            socialdays: user.socialdays
        };
        if (req.user.role == 1 || req.user.role == 10 || userinfo.role == 1 || userinfo.role == 10) {
            userinfo = { ...userinfo, ...{ phone: user.phone } };
            userinfo = { ...userinfo, ...{ email: user.email } };
        }
        const activity = await Activity.find({ "members.info.code": req.user.code });
        return res.render("otherprofile", {
            otheruser: userinfo,
            user: req.user,
            activity: activity,
        });
    }
};

function getValidMSSV(name: string): number[] {
    // met qua deo lam
    return [1610131, 1611134, 1611244, 1611967, 1612115, 1612116, 1612117];
}

export let info = async (req: Request, res: Response) => {
    try {
        const faculties = (await GeneralInfomation.find({}))[0].facultyList;
        return res.render("fill", {
            user: req.user,
            faculties: faculties,
            validmssv: getValidMSSV(req.user.fullName)
        });
    }
    catch (err) {
        const facultiesList = [
            "Khoa Bảo dưỡng Công nghiệp",
            "Khoa Cơ khí",
            "Khoa Kỹ thuật Địa chất và Dầu khí",
            "Khoa Điện - Điện tử",
            "Khoa Kỹ thuật Giao thông",
            "Khoa Kỹ thuật Hóa học",
            "Khoa Môi trường và Tài nguyên",
            "Khoa Khoa học và Kỹ thuật Máy tính",
            "Khoa Quản lý Công nghiệp",
            "Khoa Khoa học Ứng dụng",
            "Khoa Công nghệ Vật liệu",
            "Khoa Kỹ thuật Xây dựng"
        ];
        await (new GeneralInfomation({ facultyList: facultiesList })).save();
        return res.render("fill", {
            user: req.user,
            faculties: facultiesList
        });
    }
};

export let postInfo = async (req: any, res: any) => {
    req.checkBody("mssv", "MSSV không được để trống").notEmpty();
    req.checkBody("phone", "Số điện thoại không được để trống").notEmpty();
    req.checkBody("faculty", "Tên khoa không được để trống").notEmpty();

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
                "avatar": avatarlink
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
        "avatar": avatarlink,
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
