import { NextFunction, Request, Response } from "express";
import Activity from "../models/Activity";
import User from "../models/User";


export let getAddActivity = async (req: Request, res: Response) => {

    try {
        const sp = await User.find({ "role": 1 }, { "_id": 1, "fullName": 1 });
        return res.render("admin/posts/add", {
            superVisors: sp
        });
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }
};

export let listOwnActivity = async (req: Request, res: Response) => {
    const activities = await Activity.find({ "host.auth.0.googleId": req.user.auth[0].googleId });
    // console.log(activities);
    return res.render("admin/posts/list", {
        activities: activities
    });
};
export let getActivity = (req: Request, res: Response) => {
    // todo
};

export let postActivity = async (req: any, res: Response) => {
    req.checkBody("activityName").notEmpty();
    req.checkBody("register_deadline").notEmpty();
    req.checkBody("startDate").notEmpty();
    req.checkBody("endDate").notEmpty();
    req.checkBody("startTime").notEmpty();
    req.checkBody("endTime").notEmpty();
    req.checkBody("gathering_place").notEmpty();
    req.checkBody("target_place").notEmpty();
    req.checkBody("benefit").notEmpty();
    req.checkBody("numMember").notEmpty();
    req.checkBody("content").notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }
    try {
        let superVisor = [];
        if (Array.isArray(req.body.superVisor)) {
            superVisor = req.body.superVisor;
        }
        else {
            superVisor.push(req.body.superVisor);
        }

        const activity = await new Activity({
            name: req.body.activityName,
            registerEnd: req.body.register_deadline,
            dateStart: req.body.startDate,
            dateEnd: req.body.endDate,
            timeStart: req.body.endTime,
            timeEnd: req.body.endTime,
            gatheringPlace: req.body.gathering_place,
            targetPlace: req.body.target_place,
            content: req.body.content,
            orgUnit: req.body.orgUnit,
            host: req.user,
            images: [],
            videos: [],
            maxMember: req.body.numMember,
            members: [],
            comment: [],
            superVisor: superVisor,
            benefit: req.body.benefit
        });
        await activity.save();
        return res.redirect("/admin/post/list");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }

};

export let updateActivity = (req: Request, res: Response) => {
    // todo
};

export let searchActivity = (req: Request, res: Response) => {
    // todo
};

export let createReport = (req: Request, res: Response) => {
    // todo
};

export let getMember = (req: Request, res: Response) => {
    // todo
};

export let postComment = async (req: any, res: Response) => {
    req.checkBody("comment", "Comment không được để trống").notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }

    const activityId = req.params.id;
    try {
        const activity = await Activity.findOne({ "_id": activityId });
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

export let getComment = (req: Request, res: Response) => {
    // todo
};

export let getUserActivity = (req: Request, res: Response) => {
    // todo
};

export let activityDetail = async (req: Request, res: Response) => {
    const activityId = req.params.id;
    const unit = await Activity.find({}, { orgUnit: 1, _id: 0 });
    const a = [], b = [];
    let prev;
    unit.sort();
    for (let i = 0; i < unit.length; i++) {
        if (unit[i].orgUnit !== prev) {
            a.push({ orgUnit: unit[i].orgUnit });
            b.push({ num: 1 });
        } else {
            b[b.length - 1].num++;
        }
        prev = unit[i].orgUnit;
    }
    for (let i = 0; i < a.length; i++) {
        a[i] = { ...a[i], ...b[i] };
    }
    try {
        const activity = await Activity.findOne({ "_id": activityId });
        let registered = false;
        if (activity.members.filter(member => member.mssv === req.user.code).length > 0) registered = true;
        return res.render("activityDetail", {
            user: req.user,
            activity: activity,
            registered: registered,
            orgUnit: a
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
        const activity = await Activity.findOne({ "_id": activityId });
        const membersAfterRemove = activity.members.filter(member => member.mssv !== req.user.code);
        await Activity.updateOne({ "_id": activityId }, {
            members: membersAfterRemove
        }, { upset: false });
        await activity.save();
        return res.redirect("back");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("/");
    }
};


export let apply = async (req: Request, res: Response, next: NextFunction) => {
    const activityId = req.params.id;
    try {
        const activity = await Activity.findOne({ "_id": activityId });
        const registered = (activity.members.filter(member => member.mssv === req.user.code).length > 0);
        if (registered) return res.redirect("back");
        activity.members.push({
            _id: req.user.code,
            mssv: req.user.code,
            name: req.user.fullName,
            faculty: req.user.faculty
        });
        await activity.save();
        res.locals.activity = activity;
        res.locals.user = req.user;
        next();
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("/");
    }
};

