import { Response, Request, NextFunction } from "express";

export let isLoggin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) next();
    else return res.redirect("/auth/google");
};