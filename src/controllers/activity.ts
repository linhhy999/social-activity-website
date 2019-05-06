import { Request, Response } from "express";


export let getAddActivity = (req: Request, res: Response) => {
    return res.render("admin/posts/add");
};

export let listOwnActivity = (req: Request, res: Response) => {
    return res.render("admin/posts/list");
};
export let getActivity =  (req: Request, res: Response) => {
    // todo
};

export let postActivity =  (req: Request, res: Response) => {
    // todo
};

export let updateActivity =  (req: Request, res: Response) => {
    // todo
};

export let searchActivity =  (req: Request, res: Response) => {
    // todo
};

export let createReport =  (req: Request, res: Response) => {
    // todo
};

export let getMember =  (req: Request, res: Response) => {
    // todo
};

export let postComment =  (req: Request, res: Response) => {
    // todo
};

export let getComment =  (req: Request, res: Response) => {
    // todo
};

export let getUserActivity = (req: Request, res: Response) => {
    // todo
};