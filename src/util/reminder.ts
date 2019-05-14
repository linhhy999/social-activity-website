const mail = require("./email");
const niceTimeToMail = [6, 10, 14, 19];


function findAndRemind() {
    console.log("Remind mail sent", (new Date()).toISOString());

}

export function remindTrigger() {
    niceTimeToMail.forEach(element => {
        const time1 = new Date();
        const time2 = new Date();
        time2.setHours(element, 0, 0, 0);
        if (time1 > time2) time2.setDate(time2.getDate() + 1);
        setTimeout(() => { setInterval(() => { findAndRemind(); }, 86400000); }, (time2.getTime() - time1.getTime()));
    });
}