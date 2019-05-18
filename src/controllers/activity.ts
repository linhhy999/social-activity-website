import { NextFunction, Request, Response } from "express";
import Activity, { Status, Join } from "../models/Activity";
import GeneralInfomation from "../models/General";
import User from "../models/User";
import { createNotificationByCode } from "./notification";
import { buildReport, ExportFile } from "./export";


export let getAddActivity = async (req: Request, res: Response) => {
    try {
        const sp = await User.find({ "role": 1 }, { "_id": 1, "fullName": 1 });
        const faculties = (await GeneralInfomation.find({}))[0].facultyList;
        return res.render("admin/posts/add", {
            superVisors: sp,
            faculties: faculties
        });
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }
};

export let listOwnActivity = async (req: Request, res: Response) => {
    const activityList = await Activity.find({ "host": req.user._id });
    const activities = [];
    for (const activity of activityList) {
        let numMember = 0;
        let numPendingMember = 0;
        for (const member of activity.members) {
            if (member.status == 1) numPendingMember++;
            if (member.status == 2) numMember++;
        }
        activities.push({
            id: activity.id,
            name: activity.name,
            start: activity.dateStart + " " + activity.timeStart,
            numMember: numMember,
            numPendingMember: numPendingMember,
            status: activity.status ? "Đang diễn ra" : "Đã xong"
        });
    }
    return res.render("admin/posts/list", {
        activities: activities
    });
};

export let listManageActivity = async (req: Request, res: Response) => {
    const activityList = await Activity.find({ "superVisor": req.user.  id });
    const activities = [];
    for (const activity of activityList) {
        let numMember = 0;
        let numPendingMember = 0;
        for (const member of activity.members) {
            if (member.status == 1) numPendingMember++;
            if (member.status == 2) numMember++;
        }
        activities.push({
            id: activity.id,
            name: activity.name,
            start: activity.dateStart + " " + activity.timeStart,
            numMember: numMember,
            numPendingMember: numPendingMember,
            status: activity.status ? "Đang diễn ra" : "Đã xong"
        });
    }
    return res.render("admin/posts/manage", {
        activities: activities
    });
};

export let getActivityDetail = async (req: Request, res: Response) => {
    try {
        const activity = await Activity.findById(req.params.id);
        const superVisor = [];
        for (const visor of activity.superVisor) {
            superVisor.push(await User.findById(visor));
        }
        return res.render("admin/posts/detail", {
            activity: activity,
            superVisor: superVisor,
        });
    }
    catch (er) {
        console.log(er.message);
    }
    const activity = await Activity.findById(req.params.id);
};
export let getActivity = (req: Request, res: Response) => {
    // todo
};

export let postActivity = async (req: any, res: Response) => {
    try {
        let superVisor = [];
        if (Array.isArray(req.body.superVisor)) {
            superVisor = req.body.superVisor;
        }
        else {
            superVisor.push(req.body.superVisor);
        }
        const images = [];
        for (const file of req.files) {
            images.push({
                id: Date.now(),
                link: "/uploads/" + file.filename
            });
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
            orgUnit: req.user.faculty,
            host: req.user._id,
            image: images,
            video: [],
            maxMember: req.body.numMember,
            members: [],
            comment: [],
            superVisor: superVisor,
            benefit: req.body.benefit,
            status: true
        });
        await activity.save();
        req.flash("info", { message: "OK!" });
        return res.redirect("/admin/post/list");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }

};

export let postEditActivity = async (req: any, res: Response) => {
    try {
        let superVisor = [];
        if (Array.isArray(req.body.superVisor)) {
            superVisor = req.body.superVisor;
        }
        else {
            superVisor.push(req.body.superVisor);
        }
        const images = [];
        for (const file of req.files) {
            images.push({
                id: (file.filename + Date.now()).replace(".", ""),
                link: "/uploads/" + file.filename
            });
        }
        await Activity.updateOne({ _id: req.params.id }, {
            name: req.body.activityName,
            registerEnd: req.body.register_deadline,
            dateStart: req.body.startDate,
            dateEnd: req.body.endDate,
            timeStart: req.body.endTime,
            timeEnd: req.body.endTime,
            gatheringPlace: req.body.gathering_place,
            targetPlace: req.body.target_place,
            content: req.body.edit_content,
            orgUnit: req.body.orgUnit,
            host: req.user._id,
            video: [],
            maxMember: req.body.numMember,
            superVisor: superVisor,
        }, { upset: false });
        await Activity.updateOne({ _id: req.params.id }, {
            $push: { image: images }
        }, { upset: false });
        req.flash("info", { message: "Updated!" });
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

export let searchActivity = async (req: Request, res: Response) => {
    let activities: any[];
    if (!req.query.keyword) {
        activities = [];
    }
    else {
        activities = await Activity.find({
            $or:
                [
                    { name: { $regex: req.query.keyword, $options: "$i" } },
                    { content: { $regex: req.query.keyword, $options: "$i" } },
                    { targetPlace: { $regex: req.query.keyword, $options: "$i" } },
                    { gatheringPlace: { $regex: req.query.keyword, $options: "$i" } },
                    { dateStart: { $regex: req.query.keyword, $options: "$i" } },
                    { orgUnit: { $regex: req.query.keyword, $options: "$i" } },
                    // { "host.fullName": { $regex: req.query.keyword, $options: "$i" } },
                ]
        });
    }
    return res.render("search", {
        title: "Search",
        activities: activities,
        action: {}
    });
};

export let searchAdvancedActivity = async (req: Request, res: Response) => {
    const query = [];
    switch (req.body.type) {
        case "1": {
            query.push({ name: { $regex: req.query.keyword, $options: "$i" } });
            break;
        }
        case "2": {
            query.push({ orgUnit: { $regex: req.query.keyword, $options: "$i" } });
            break;
        }
        case "3": {
            query.push({ gatheringPlace: { $regex: req.query.keyword, $options: "$i" } });
            query.push({ targetPlace: { $regex: req.query.keyword, $options: "$i" } });
            break;
        }
        // case "4": {
        //    query.push({ "host.fullName": { $regex: req.query.keyword, $options: "$i" } });
        //    break;
        // }
    }
    switch (req.body.status) {
        case "1": {
            query.push({ status: true });
            break;
        }
        case "2": {
            query.push({
                $or: [
                    { status: false },
                    { status: undefined }
                ]
            });
            break;
        }
    }
    switch (req.body.benefit) {
        case "1": {
            query.push({ benefit: 0.5 });
            break;
        }
        case "2": {
            query.push({ benefit: 1 });
            break;
        }
        case "3": {
            query.push({ benefit: 1.5 });
            break;
        }
        case "4": {
            query.push({ benefit: 2 });
            break;
        }
        case "5": {
            query.push({ benefit: { $gt: 2 } });
            break;
        }
    }
    const activities = await Activity.find({ $and: query });
    return res.render("search", {
        title: "Search",
        activities: activities,
        action: {
            type: req.body.type,
            status: req.body.status,
            benefit: req.body.benefit
        }
    });
};

export let createReport = (req: Request, res: Response) => {
    // todo
};

export let getMember = async (req: Request, res: Response) => {
    try {
        const members = (await Activity.findById(req.params.activity)).members;
        return res.render("admin/posts/member", {
            members: members,
            pending: members.filter((obj) => obj.status === 1).length,
            accept: members.filter((obj) => obj.status === 2).length,
            refuse: members.filter((obj) => obj.status === 3).length,
            activity: req.params.activity
        });
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }

};

export let getAcceptMember = async (req: Request, res: Response, next: NextFunction) => {
    await Activity.updateOne({ _id: req.params.activity, "members.mssv": req.params.mssv }, { "$set": { "members.$.status": 2 } });
    await createNotificationByCode(req.params.mssv, {
        image: req.user.auth[0].picture,
        title: "Đăng ký hoạt động thành công",
        time: new Date(),
        content: "Yêu cầu tham gia hoạt động của bạn đã được chấp nhận",
        link: "/activity-detail/" + req.params.activity
    });
    res.locals.mssv = req.params.mssv;
    res.locals.activity = req.params.activity;
    // next();
    return res.redirect("back");
};

export let getRefuseMember = async (req: Request, res: Response) => {
    await Activity.updateOne({ _id: req.params.activity, "members.mssv": req.params.mssv }, {
        "$set": {
            "members.$.status": 3
        }
    });
    return res.redirect("back");
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
        activity.comment.unshift({
            fullName: req.user.fullName,
            timeComment: new Date,
            userAvatar: req.user.avatar,
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
        const userActivity = activity.members.find(function (element) {
            return element.mssv == req.user.code;
        });
        let status = 0;
        userActivity ? status = userActivity.status : status = 0;
        const uA = await Activity.find({ "members.mssv": req.user.code });
        return res.render("activityDetail", {
            user: req.user,
            activity: activity,
            registered: registered,
            orgUnit: a,
            status: status,
            userActivities: uA
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


export let apply = async (req: Request, res: Response) => {
    const activityId = req.params.id;
    try {
        const activity = await Activity.findOne({ "_id": activityId });
        const registered = (activity.members.filter(member => member.mssv === req.user.code).length > 0);
        if (registered) return res.redirect("back");
        activity.members.push({
            mssv: req.user.code,
            name: req.user.fullName,
            faculty: req.user.faculty,
            phone: req.user.phone,
            email: req.user.email,
            status: Status.PENDING,
            isJoined: Join.WAITING,
            point: 0,
            note: ""
        });
        await activity.save();
        res.locals.activity = activity;
        res.locals.user = req.user;
        return res.redirect("back");
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("/");
    }
};

export let postDeleteImage = async (req: Request, res: Response) => {
    try {
        const activity = await Activity.findOne({ "_id": req.body.activity });
        const image = activity.image.filter(function (el) {
            return el.id != req.body.id;
        });
        await Activity.updateOne({ "_id": req.body.activity }, { image: image }, { upset: false });
        return res.status(200).json("ok");
    }
    catch (err) {
        console.log(err.message);
        return res.status(404).json("fail");
    }
};

export let getReport = async (req: Request, res: Response) => {
    try {
        const activity = await Activity.findOne({ "_id": req.params.activity });
        return res.render("admin/report/report", {
            activity: activity
        });
    }
    catch (err) {
        console.log(err.message);
        return res.status(404).json("fail");
    }
};

export let postReport = async (req: Request, res: Response) => {
    try {
        const activity = await Activity.findOne({ "_id": req.params.activity });
        const members = activity.members;
        if (members.length != req.body.member.length) {
            return res.redirect("back");
        }
        members.map(function (member, index) {
            member.isJoined = parseInt(req.body.member[index]);
            member.point = parseInt(req.body.point[index]);
            member.note = req.body.note[index];
            members[index] = member;
        });
        await Activity.updateOne({_id: req.params.activity}, {
            members: members
        });
        const dataset: ExportFile[] = [];
        for (const [index, member] of members.entries()) {
            console.log(member.isJoined == Join.ABSENT,  member);
            dataset.push({
                id: index + 1,
                fullName: member.name,
                code: member.mssv,
                faculty: member.faculty,
                email: member.email,
                phone: member.phone,
                socialDay: member.point,
                note: (member.note == "") ? ((member.isJoined == Join.ABSENT) ? "Vắng không phép" :  ((member.isJoined == Join.ABSENT_WITH_PERMISSION) ? "Vắng có phép" : member.note)) : member.note
            });
        }
        const report = buildReport(dataset);
        await Activity.updateOne({_id: req.params.activity}, {
            status: false
        });

        res.attachment("report.xlsx"); // This is sails.js specific (in general you need to set headers)
        return res.send(report);
    }
    catch (err) {
        console.log(err.message);
        return res.status(404).json("fail");
    }
};