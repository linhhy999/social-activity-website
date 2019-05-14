import errorHandler from "errorhandler";
import app from "./app";

/**
 * Error Handler. Provides full stack - remove for production
 */

app.use(errorHandler());

/**
 * Start Express server.
 */

export const server = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode at %s",
        app.get("port"),
        app.get("env"),
        new Date()
    );
    console.log("  Press CTRL-C to stop\n");
});

const niceTimeToMail = [6, 10, 14, 19];
niceTimeToMail.forEach(element => {
    const time1 = new Date();
    const time2 = new Date();
    time2.setHours(element, 0, 0, 0);
    if (time1 > time2) time2.setDate(time2.getDate() + 1);
    setTimeout(() => { setInterval(() => { alert("Chào mừng bạn đến với freetuts.net"); }, 86400); }, Math.floor((time2.getTime() - time1.getTime()) / 1000));
});