import { Request, Response } from "express";


/**
 * GET /
 * Home page.
 */
export let index = async (req: Request, res: Response) => {
    res.render("newsfeed", {});
};

export let login = async (req: Request, res: Response) => {
    // todo
};

export let logout = async (req: Request, res: Response) => {
    // todo
};