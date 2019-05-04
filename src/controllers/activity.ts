import { Request, Response } from "express";
import Activity from "../models/Activity";
import User from "../models/User";


export let getAddActivity = async (req: Request, res: Response) => {

    try {
        const sp = await User.find({"role": 1}, {"_id": 1, "fullName": 1});
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
    const activities = await User.find({"host.auth.0.googleId": req.user.auth[0].googleId});
    console.log(activities);
    // return res.render("admin/posts/list", {
    //     activities: activities
    // });
};
export let getActivity =  (req: Request, res: Response) => {
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
        for (const data of [...[], req.body.superVisor]) {
            superVisor.push(await User.findById(data));
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

export let activityDetail = (req: Request, res: Response) => {
    // todo
    return res.render("activityDetail", {});
};