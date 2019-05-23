import Activity, { Status } from "../models/Activity";
import User from "../models/User";
const mail = require("../util/email");

import { NextFunction, Request, Response } from "express";
import moment = require("moment");
moment.locale("de");
let i = 0;

export let registered = async (student: any, activity: any) => {
    mail.registered(student.fullName, student.email, activity.name, "http://localhost:3000/activity-detail/" + activity._id);
    console.log("Sending " + ++i + " mail(s) to " + student.fullName + " " + student.email + " " + activity.name + " " + "http://localhost:3000/activity-detail/" + activity._id);
};

export let reminder = async () => {
    const activities = await Activity.find({status: true});
    activities.forEach(activity => {
        const myDate = moment(new Date(activity.dateStart), "MM/DD/YYYY").subtract(1, "days").isSame(moment((new Date()).toLocaleDateString(), "MM/DD/YYYY"));
        if (myDate) {
            const members = activity.members;
            members.forEach(member => {
                if (member.status == Status.ACCEPT) {
                    mail.remind(member.info.fullName, member.info.email, activity.name, activity.dateStart, "http://localhost:3000/activity-detail/" + activity._id);
                }
            });
        }

    });
};