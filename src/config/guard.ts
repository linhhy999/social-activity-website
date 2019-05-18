import { NextFunction, Request, Response } from "express";
import User from "../models/User";

export let isLogin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    }
    else return res.redirect("/intro"); // làm ơn đừng sửa cái này nữa :( cái này m đè của t 3-4 lần rồi
};

export let isFill = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.code === undefined || req.user.faculty === undefined || req.user.fullName === undefined || req.user.phone === undefined || req.user.socialday === undefined)
        return res.redirect("/info");
    next();
};

export let hasPermission = (...role: number[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (role.indexOf(req.user.role) != -1) {
            return next();
        }
        else return res.redirect("/");
        // else return res.render("errors/403");
    };
};

export let legitActivityInfo = (req: Request, res: Response, next: NextFunction) => {
    req.checkBody("activityName", "Tên hoạt động không được để trống").notEmpty();
    req.checkBody("register_deadline", "Hạn đăng ký không được để trống").notEmpty();
    req.checkBody("startDate", "Ngày bắt đầu không được để trống").notEmpty();
    req.checkBody("endDate", "Ngày kết thúc không được để trống").notEmpty();
    req.checkBody("startTime", "Giờ bắt đầu không được để trống").notEmpty();
    req.checkBody("endTime", "Giờ kết thúc không được để trống").notEmpty();
    req.checkBody("gathering_place", "Địa điểm tập trung không được để trống").notEmpty();
    req.checkBody("numMember", "Số thành viên tối đa không được để trống").notEmpty();
    req.checkBody("content", "Nội dung hoạt động không được để trống").notEmpty();
    req.checkBody("superVisor", "Người giám sát không được để trống").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }

    console.log(req.body.register_deadline);

    next();
};

export let notblocked = async (req: Request, res: Response, next: NextFunction) => {
    if (req.path == "/" || req.path == "/intro" || req.path == "/auth/google/callback" || req.path == "/auth/google") return next();
    if (req.user)
        if (req.user.isBlocked) {
            const user = await User.findById(req.user._id);
            if (user.isBlocked) {
                req.logout();
                return res.redirect("/");
            }
        }
    next();
};