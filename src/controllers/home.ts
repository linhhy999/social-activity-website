import { Request, Response } from "express";


/**
 * GET /
 * Home page.
 */

export let intro = async (req: Request, res: Response) => {
    res.render("index", {});
};

export let index = async (req: Request, res: Response) => {
    res.render("newsfeed", {});
};

export let admin = async (req: Request, res: Response) => {
    res.render("admin/index", {});
};

export let login = async (req: Request, res: Response) => {
    // todo
};

export let logout = async (req: Request, res: Response) => {
    // todo
};