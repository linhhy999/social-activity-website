import User from "../models/User";
import { Request, Response } from "express";

export let getListAccounts = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        return res.render("admin/accounts/list", {
            users: users
        });
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
            isBlock: true
        });
        return res.redirect("/admin/account/list");
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
        const users = await User.updateOne({ code: id }, {
            role: newRole
        });
        return res.redirect("/admin/account/list");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }
};