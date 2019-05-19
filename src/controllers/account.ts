import User from "../models/User";
import { Request, Response } from "express";
import GeneralInfomation from "../models/General";

export let getListAccounts = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        const students = users.filter((user) => {
            return user.role == 5;
        });
        const hosts = users.filter((user) => {
            return user.role == 10;
        });
        const admins = users.filter((user) => {
            return user.role == 1;
        });
        return res.render("admin/accounts/list", {
            students: students,
            hosts: hosts,
            admins: admins,
            title: "Danh sách tài khoản"
        });
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }
};

export let getAddAccounts = async (req: Request, res: Response) => {
    const faculties = (await GeneralInfomation.find({}))[0].facultyList;
    return res.render("admin/accounts/add", {
        faculties: faculties,
        title: "Thêm tài khoản",
    });
};

export let postAddAccounts = async (req: any, res: Response) => {
    req.checkBody("phone", "Số điện thoại không được để trống").notEmpty();
    req.checkBody("faculty", "Tên khoa không được để trống").notEmpty();
    req.checkBody("code", "MSSV/MSCB không được để trống").notEmpty();
    req.checkBody("fullName", "Tên không được để trống").notEmpty();
    req.checkBody("email", "Email không được để trống").notEmpty();
    req.checkBody("role", "Quyền không được để trống").notEmpty();
    const errors = req.validationErrors();

    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }

    try {
        await (new User({
            "phone": req.body.phone,
            "code": req.body.code,
            "faculty": req.body.faculty,
            "fullName": req.body.name,
            "email": req.body.email,
            "role": req.body.role,
            "numWorkDay": req.body.numWorkDay
        })).save();
        req.flash("info", { msg: "OK!" });
        return res.redirect("back");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }
};

export let postBlockAccount = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await User.updateOne({ _id: id }, {
            isBlocked: true
        });
        return res.redirect("back");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }
};

export let postUnBlockAccount = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await User.updateOne({ _id: id }, {
            isBlocked: false
        });
        return res.redirect("back");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }
};

export let postChangeRole = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newRole = req.params.newRole;
        await User.updateOne({ _id: id }, {
            role: newRole
        });
        return res.redirect("/admin/account/list");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }
};