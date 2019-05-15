import { NextFunction, Request, Response } from "express";

export let isLogin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) next();
    // else return res.redirect("/auth/google");
    else return res.redirect("intro");
};