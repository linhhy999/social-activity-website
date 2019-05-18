import { NextFunction, Request, Response } from "express";
import User from "../models/User";

export let isLogin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    }
    else return res.redirect("/auth/google");
};

export let isFill = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.code === undefined || req.user.faculty === undefined || req.user.fullName === undefined || req.user.phone === undefined) {
        return res.redirect("/info");
    }
    next();
};
export let checkRole = (...role: number[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (role.indexOf(req.user.role) != -1) {
            return next();
        }
        else return res.render("errors/403");
    };
};
