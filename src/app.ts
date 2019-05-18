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
import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(undefined, "src/public/uploads/");
    },
    filename: function (req, file, cb) {
        const tmp = file.originalname.split(".");
        const ext = tmp[tmp.length - 1];
        console.log(file.filename, ext);
        cb(undefined, tmp[0] + Date.now() + "." + ext);
  }
});


const upload = multer({ storage: storage });
// Load secret and logger
import { MONGODB_URI, APP_PORT, SESSION_SECRET } from "./util/secrets";
import logger from "./util/logger";


const MongoStore = mongo(session);

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as activityController from "./controllers/activity";
import * as userController from "./controllers/user";
import * as accountController from "./controllers/account";
import * as generalController from "./controllers/general";
import * as Guard from "./config/guard";
import * as passportConfig from "./config/passport";
import { Role } from "./models/User";

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
    app.locals.moment = moment;
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
app.get("/activity-detail/:id", Guard.isLogin, Guard.isFill, activityController.activityDetail);
app.get("/apply/:id", Guard.isLogin, Guard.isFill, activityController.apply);
app.get("/un_apply/:id", Guard.isLogin, Guard.isFill, activityController.un_apply);
app.post("/comment/:id", Guard.isLogin, Guard.isFill, activityController.postComment);
app.get("/search/", Guard.isLogin, Guard.isFill, activityController.searchActivity);
app.post("/search/", Guard.isLogin, Guard.isFill, activityController.searchAdvancedActivity);


app.get("/intro", homeController.intro);
app.get("/auth/google", passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/userinfo.email"] }));
app.get("/auth/google/callback", passportConfig.isGoogleAuthenticated,
homeController.login);
app.get("/", Guard.isLogin, Guard.isFill, homeController.index);
app.get("/logout", Guard.isLogin, Guard.isFill, homeController.logout);
app.get("/admin", Guard.isLogin, Guard.isFill, Guard.checkRole(Role.Admin), homeController.admin);
app.get("/profile", Guard.isLogin, Guard.isFill, userController.profile);
app.get("/info", Guard.isLogin, userController.info);
app.post("/info", Guard.isLogin, userController.postInfo);
app.get("/admin/post/list", Guard.isLogin, Guard.isFill, Guard.checkRole(Role.Admin), activityController.listOwnActivity);
app.get("/admin/general", Guard.isLogin, Guard.isFill, Guard.checkRole(Role.Admin), generalController.getGeneralInfomation);

app.get("/admin/post/detail/:id", Guard.isLogin, Guard.isFill, activityController.getActivityDetail);
app.get("/admin/post/add", Guard.isLogin, Guard.isFill, Guard.checkRole(Role.Admin), activityController.getAddActivity);
app.post("/admin/post/add", Guard.isLogin, Guard.isFill, Guard.checkRole(Role.Admin), upload.array("image"), activityController.postActivity);
app.post("/admin/post/edit/:id", Guard.isLogin, Guard.isFill, upload.array("image"), activityController.postEditActivity);
app.post("/admin/post/block/:id", Guard.isLogin, Guard.isFill, activityController.postActivity);
app.get("/admin/post/member/:activity", Guard.isLogin, Guard.isFill, activityController.getMember);
app.get("/admin/post/member/:activity/accept/:mssv", Guard.isLogin, Guard.isFill, activityController.getAcceptMember);
app.get("/admin/post/member/:activity/refuse/:mssv", Guard.isLogin, Guard.isFill, activityController.getRefuseMember);
app.get("/admin/account/list", Guard.isLogin, Guard.isFill, Guard.checkRole(Role.Admin), accountController.getListAccounts);
app.get("/admin/account/add", Guard.isLogin, Guard.isFill, Guard.checkRole(Role.Admin), accountController.getAddAccounts);
app.post("/admin/account/add", Guard.isLogin, Guard.isFill, Guard.checkRole(Role.Admin), accountController.postAddAccounts);
app.get("/admin/account/block/:id", Guard.isLogin, Guard.isFill, Guard.checkRole(Role.Admin), accountController.postBlockAccount);
app.get("/admin/account/unblock/:id", Guard.isLogin, Guard.isFill, Guard.checkRole(Role.Admin), accountController.postUnBlockAccount);
app.get("/admin/account/modifyRole/:id/:newRole", Guard.isLogin, Guard.isFill, Guard.checkRole(Role.Admin), accountController.postChangeRole);

app.post("/ajax/delete/image", activityController.postDeleteImage);
export default app;