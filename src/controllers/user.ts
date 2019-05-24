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
    if (req.params.code == undefined) {
        const activity = await Activity.find({ "members.info.code": req.user.code });
        const faculties = (await GeneralInfomation.find({}))[0].facultyList;
        return res.render("profile", {
            user: req.user,
            faculties: faculties,
            activity: activity,
            validmssv: getValidMSSV(req.user.fullName)
        });
    }
    else {
    }
};

function getValidMSSV(name: string): number[] {
    // met qua deo lam
    return [1612115, 1711947];
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
