import Activity, { Status } from "../models/Activity";
import moment = require("moment");
const mail = require("../util/email");
moment.locale("de");
let i = 0;

export let registered = async (student: any, activity: any) => {
    mail.registered(student.fullName, student.email, activity.name, "https://sociofy.lyhc.tk/activity-detail/" + activity._id);
    console.log("Sending " + ++i + " mail(s) to " + student.fullName + " " + student.email + " " + activity.name + " " + "https://sociofy.lyhc.tk/activity-detail/" + activity._id);
};
export let refused = async (student: any, activity: any) => {
    mail.refused(student.fullName, student.email, activity.name, "https://sociofy.lyhc.tk/activity-detail/" + activity._id);
    console.log("Sending " + ++i + " mail(s) to " + student.fullName + " " + student.email + " " + activity.name + " " + "https://sociofy.lyhc.tk/activity-detail/" + activity._id);
};
export let reminder = async () => {
    const activities = await Activity.find({ status: true });
    activities.forEach(activity => {
        const myDate = moment(new Date(activity.dateStart), "MM/DD/YYYY").subtract(1, "days").isSame(moment((new Date()).toLocaleDateString(), "MM/DD/YYYY"));
        if (myDate) {
            const members = activity.members;
            members.forEach(member => {
                if (member.status == Status.ACCEPT) {
                    mail.remind(member.info.fullName, member.info.email, activity.name, activity.dateStart, "https://sociofy.lyhc.tk/activity-detail/" + activity._id);
                }
            });
        }

    });
};