import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "./config/passport";
import expressValidator from "express-validator";
import bluebird from "bluebird";
import moment from "moment-timezone";

// Load secret and logger
import { MONGODB_URI, APP_PORT, SESSION_SECRET } from "./util/secrets";
import logger from "./util/logger";


const MongoStore = mongo(session);

// Controllers (route handlers)
import * as HomeController from "./controllers/home";
import * as ActivityController from "./controllers/activity";
import * as UserController from "./controllers/user";
import * as AccountController from "./controllers/account";
import * as Guard from "./config/guard";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
// @ts-ignore
mongoose.connect(mongoUrl, { useCreateIndex: true, useNewUrlParser: true }).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch((err: any) => {
    logger.error("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
});

// Express configuration
app.set("port", APP_PORT);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
       url: mongoUrl,
       autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== "/login" &&
        req.path !== "/signup" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
        req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
/**
 * Primary app routes.
 */
app.get("/activity-detail/:id", Guard.isLogin, ActivityController.activityDetail);
app.get("/apply/:id", Guard.isLogin, ActivityController.apply);
app.get("/un_apply/:id", Guard.isLogin, ActivityController.un_apply);
app.post("/comment/:id", Guard.isLogin, ActivityController.postComment);


app.get("/intro", HomeController.intro);
app.get("/auth/google", passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/userinfo.email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }),
HomeController.login);
app.get("/", Guard.isLogin, HomeController.index);
app.get("/logout", Guard.isLogin, HomeController.logout);
app.get("/admin", Guard.isLogin, HomeController.admin);
app.get("/profile", Guard.isLogin, UserController.profile);
app.get("/info", Guard.isLogin, UserController.info);
app.post("/info", Guard.isLogin, UserController.postInfo);
app.get("/admin/post/list", Guard.isLogin, ActivityController.listOwnActivity);
app.get("/admin/post/add", Guard.isLogin, ActivityController.getAddActivity);
app.post("/admin/post/add", Guard.isLogin, ActivityController.postActivity);
app.get("/admin/account/list", Guard.isLogin, AccountController.getListAccounts);
app.get("/admin/account/block/:id", Guard.isLogin, AccountController.postBlockAccount)
app.get("/admin/account/modifyRole/:id/:newRole", Guard.isLogin, AccountController.postChangeRole)

export default app;