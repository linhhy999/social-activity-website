import { NextFunction, Request, Response } from "express";
import Activity, { Status, Join } from "../models/Activity";
import GeneralInfomation from "../models/General";
import User from "../models/User";
import { createNotificationByCode } from "./notification";
import { buildReport, ExportFile } from "./export";
import { find } from "shelljs";
import { registered, refused } from "./email";

export let getAddActivity = async (req: Request, res: Response) => {
    try {
        const sp = await User.find({ "role": 1 }, { "_id": 1, "fullName": 1 });
        const faculties = (await GeneralInfomation.find({}))[0].facultyList;
        return res.render("admin/posts/add", {
            superVisors: sp,
            faculties: faculties,
            title: "Thêm hoạt động"
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
            start: activity.dateStart,
            numMember: numMember,
            numPendingMember: numPendingMember,
            status: activity.status ? "Đang diễn ra" : "Đã xong"
        });
    }
    return res.render("admin/posts/list", {
        activities: activities,
        title: "Hoạt động của tôi"
    });
};

export let listManageActivity = async (req: Request, res: Response) => {
    const activityList = await Activity.find({ "superVisor": req.user.id });
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
            start: activity.dateStart,
            numMember: numMember,
            numPendingMember: numPendingMember,
            status: activity.status ? "Đang diễn ra" : "Đã xong"
        });
    }
    return res.render("admin/posts/manage", {
        activities: activities,
        title: "Hoạt động quản lý"

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
            title: activity.name,
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
            images.push("/uploads/" + file.filename);
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
            images: images,
            maxMember: req.body.numMember,
            members: [],
            comment: [],
            superVisor: superVisor,
            benefit: req.body.benefit,
            status: true
        });
        await activity.save();
        req.flash("info", { message: "OK!" });
        res.redirect(req.get("referer"));
    }
    catch (err) {
        console.log(err.message);
        return res.redirect("back");
    }

};

export let postEditActivity = async (req: any, res: Response) => {
    try {
        let superVisor = [];
        if (Array.isArray(req.body.superVisor)) { superVisor = req.body.superVisor; }
        else { superVisor.push(req.body.superVisor); }
        const activity = await Activity.findOne({ "_id": req.params.id });
        req.body.delimg = JSON.parse(req.body.delimg);
        const delimg: String[] = [];
        for (const i in req.body.delimg)
            delimg.push(req.body.delimg[i].link);
        const images = activity.images.filter(function (el) {
            return (delimg.lastIndexOf(el.substr(0, el.length - 4)) == -1);
        });
        for (const file of req.files)
            images.push("/uploads/" + file.filename);
        await Activity.updateOne({ _id: req.params.id }, {
            name: req.body.activityName,
            registerEnd: req.body.register_deadline,
            dateStart: req.body.startDate,
            dateEnd: req.body.endDate,
            timeStart: req.body.endTime,
            timeEnd: req.body.endTime,
            gatheringPlace: req.body.gathering_place,
            targetPlace: req.body.target_place,
            content: req.body.content,
            host: req.user._id,
            maxMember: req.body.numMember,
            superVisor: superVisor,
        }, { upset: false });
        await Activity.updateOne({ _id: req.params.id }, {
            images: images
        }, { upset: false });
        req.flash("info", { message: "Updated!" });
        res.redirect(req.get("referer"));
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
                    // { "host.info.fullName": { $regex: req.query.keyword, $options: "$i" } },
                ]
        });
    }

    return res.render("search", {
        title: req.query.keyword + "- Sociofy",
        activities: activities,
        action: {},
        key: req.query.keyword,
        isSearch: true
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
        title: req.query.keyword + "- Sociofy",
        activities: activities,
        action: {
            type: req.body.type,
            status: req.body.status,
            benefit: req.body.benefit,
        },
        isSearch: true,
        key: req.query.keyword
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
    const activity = await Activity.findOne({ _id: req.params.activity, "members._id": req.params.memberId });
    const member = activity.members.filter(member => member.info.code == req.params.mssv)[0];
    await Activity.updateOne({ _id: req.params.activity, "members._id": req.params.memberId }, { "$set": { "members.$.status": Status.ACCEPT } });
    await createNotificationByCode(req.params.mssv, {
        image: req.user.auth[0].picture,
        title: "Đăng ký hoạt động thành công",
        time: new Date(),
        content: "Yêu cầu tham gia hoạt động của bạn đã được chấp nhận",
        link: "/activity-detail/" + req.params.activity
    });
    registered(member.info, activity);
    return res.redirect("back");
};

export let getRefuseMember = async (req: Request, res: Response) => {
    const activity = await Activity.findOne({ _id: req.params.activity, "members._id": req.params.memberId });
    const member = activity.members.filter(member => member.info.code == req.params.mssv)[0];
    await Activity.updateOne({ _id: req.params.activity, "members._id": req.params.memberId }, { "$set": { "members.$.status": Status.REFUSE } });
    await createNotificationByCode(req.params.mssv, {
        image: req.user.auth[0].picture,
        title: "Bị loại khỏi hoạt động",
        time: new Date(),
        content: "Bạn đã bị loại khỏi hoạt động " + activity.name,
        link: "/activity-detail/" + req.params.activity
    });
    refused(member.info, activity);
    return res.redirect("back");
};

declare global {
    interface Date {
        toIsoString(): string;
    }
}

Date.prototype.toIsoString = function () {
    const tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? "+" : "-",
        pad = function (num: any) {
            const norm = Math.floor(Math.abs(num));
            return (norm < 10 ? "0" : "") + norm;
        };
    return " " + pad(this.getDate()) +
        "/" + pad(this.getMonth() + 1) +
        "/" + this.getFullYear() +
        " " + pad(this.getHours()) +
        ":" + pad(this.getMinutes());
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
            info: req.user._id,
            timeComment: new Date().toIsoString(),
            content: req.body.comment,
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
        const userActivity = activity.members.find(function (element) {
            return element.info.code == req.user.code;
        });
        let status = 0;
        userActivity ? status = userActivity.status : status = 0;
        const uA = await Activity.find({ "members.info.code": req.user.code });
        return res.render("activityDetail", {
            user: req.user,
            activity: activity,
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
        const membersAfterRemove = activity.members.filter(member => member.info.code !== req.user.code);
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
        const registered = (activity.members.filter(member => member.info.code === req.user.code).length > 0);
        if (registered) return res.redirect("back");
        const user = await User.findOne({ code: req.user.code });
        activity.members.push({
            info: user._id,
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
        const image = activity.images.filter(function (el) {
            return el != req.body.id;
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
        const members = activity.members.filter(member => member.status == 2);
        if (members.length != req.body.member.length) {
            console.log(members.length, req.body.member.length);
            return res.redirect("back");
        }
        members.map(function (member, index) {
            member.isJoined = parseInt(req.body.member[index]);
            member.point = parseInt(req.body.point[index]);
            member.note = req.body.note[index];
            members[index] = member;
        });
        await Activity.updateOne({ _id: req.params.activity }, {
            members: members
        });
        const dataset: ExportFile[] = [];
        for (const [index, member] of members.entries()) {
            console.log(member.isJoined == Join.ABSENT, member);
            dataset.push({
                id: index + 1,
                fullName: member.info.fullName,
                code: member.info.code,
                faculty: member.info.faculty,
                email: member.info.email,
                phone: member.info.phone,
                socialDay: member.point,
                note: (member.note == "") ? ((member.isJoined == Join.ABSENT) ? "Vắng không phép" : ((member.isJoined == Join.ABSENT_WITH_PERMISSION) ? "Vắng có phép" : member.note)) : member.note
            });
        }
        const report = buildReport(dataset);
        await Activity.updateOne({ _id: req.params.activity }, {
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

export let postLike = async (req: Request, res: Response) => {
    try {
        let text = "Unlike";
        const activity = await Activity.findOne({ "_id": req.body.activity });
        if (activity.like.includes(req.body.user)) {
            activity.like = activity.like.filter(user => user != req.body.user);
            text = "Like";
        }
        else {
            activity.like.unshift(req.body.user);
        }
        await activity.save();
        console.log(activity.like.length);
        return res.json({like: activity.like.length, text: text});
    }
    catch (err) {
        console.log(err.message);
        return res.status(404).json("fail");
    }
};