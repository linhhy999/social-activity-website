import Activity from "../models/Activity";
const mail = require("./email");
const niceTimeToMail = [6, 10, 11, 14, 19];


async function findAndRemind() {
    // const activity = await Activity.findOne({ "_id": activityId });

    console.log("Remind mail sent", (new Date()).toISOString());

}

export function remindTrigger() {
    niceTimeToMail.forEach(element => {
        const time1 = new Date();
        const time2 = new Date();
        time2.setHours(element, 0, 0, 0);
        if (time1 > time2) time2.setDate(time2.getDate() + 1);
        console.log(time2.getTime() - time1.getTime());
        setTimeout(() => { setInterval(() => { findAndRemind(); }, 86400000); }, (time2.getTime() - time1.getTime()));
        setTimeout(() => { findAndRemind(); }, (time2.getTime() - time1.getTime()));
    });
}