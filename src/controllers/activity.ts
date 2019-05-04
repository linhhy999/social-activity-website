import { Request, Response } from "express";
import Activity from "../models/Activity";


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

export let postComment = async (req: Request, res: Response) => {
    req.checkBody("comment", "Comment không được để trống").notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }

    const activityId = req.params.id;
    try {
        const activity = await Activity.findOne({"_id": activityId});
        activity.comment.push({
            userId: req.user._id,
            timeComment: new Date,
            content: req.body.comment,
            reply: []
        });
        await activity.save();
        return res.redirect("back");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("/");
    }
};

export let getComment =  (req: Request, res: Response) => {
    // todo
};

export let getUserActivity = (req: Request, res: Response) => {
    // todo
};

export let activityDetail = async  (req: Request, res: Response) => {
    const activityId = req.params.id;
    try {
        const activity = await Activity.findOne({"_id": activityId});
        const registed = true;
        return res.render("activityDetail", {
            user: req.user,
            activity: activity,
            is: registed
        });
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("/");
    }
};
export let un_apply = async (req: Request, res: Response) => {
    const activityId = req.params.id;
    try {
        const activity = await Activity.findOne({"_id": activityId});
        activity.members.remove({
            mssv: req.user.code,
            name: req.user.fullName
        });
        await activity.save();
        return res.redirect("back");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("/");
    }
};
export let apply = async (req: Request, res: Response) => {
    const activityId = req.params.id;
    try {
        const activity = await Activity.findOne({"_id": activityId});
        activity.members.push({
            mssv: req.user.code,
            name: req.user.fullName
        });
        await activity.save();
        return res.redirect("back");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("/");
    }
};