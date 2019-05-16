import bluebird from "bluebird";
import bodyParser from "body-parser";
import compression from "compression"; // compresses requests
import mongo from "connect-mongo";
import express from "express";
import flash from "express-flash";
import session from "express-session";
import expressValidator from "express-validator";
import lusca from "lusca";
import moment from "moment";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import * as Guard from "./config/guard";
import passport, * as passportConfig from "./config/passport";
import * as activityController from "./controllers/activity";
import * as emailController from "./controllers/email";
// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as UserController from "./controllers/user";
import logger from "./util/logger";
// Load secret and logger
import { APP_PORT, MONGODB_URI, SESSION_SECRET } from "./util/secrets";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(undefined, "src/public/uploads/");
    },
    filename: function (req, file, cb) {
        const tmp = file.originalname.split(".");
        const ext = tmp[tmp.length - 1];
        cb(undefined, tmp[0] + Date.now() + "." + ext);
    }
});


const upload = multer({ storage: storage });


const MongoStore = mongo(session);



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
    process.exit();
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
// app.enable("trust proxy");
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);
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
// remindTrigger();
// const apiLimiter = rateLimit({
//     windowMs: 5 * 1000, // 5 seconds
//     max: 1,
//     handler: () => { }
// });

/**
 * Primary app routes.
 */
app.get("/activity-detail/:id", Guard.isLogin, activityController.activityDetail);
app.post("/apply/:id", Guard.isLogin, activityController.apply);
app.post("/un_apply/:id", Guard.isLogin, activityController.un_apply);
app.post("/comment/:id", Guard.isLogin, activityController.postComment);
app.get("/search/", Guard.isLogin, activityController.searchActivity);
app.post("/search/", Guard.isLogin, activityController.searchAdvancedActivity);


app.get("/intro", homeController.intro);
app.get("/auth/google", passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/userinfo.email"] }));
app.get("/auth/google/callback", passportConfig.isGoogleAuthenticated, homeController.login);
app.get("/", Guard.isLogin, homeController.index);
app.get("/logout", Guard.isLogin, homeController.logout);
app.get("/admin", Guard.isLogin, homeController.admin);
app.get("/profile", Guard.isLogin, UserController.profile);
app.post("/profile/update", Guard.isLogin, UserController.updateProfile);
app.get("/info", Guard.isLogin, UserController.info);
app.post("/info", Guard.isLogin, UserController.postInfo);
app.get("/admin/post/list", Guard.isLogin, activityController.listOwnActivity);
app.get("/admin/post/detail/:id", Guard.isLogin, activityController.getActivityDetail);
app.get("/admin/post/add", Guard.isLogin, activityController.getAddActivity);
app.post("/admin/post/add", Guard.isLogin, upload.array("image"), activityController.postActivity);
app.post("/admin/post/edit/:id", Guard.isLogin, upload.array("image"), activityController.postEditActivity);
app.post("/admin/post/block/:id", Guard.isLogin, activityController.postActivity);
app.get("/admin/post/member/:activity", Guard.isLogin, activityController.getMember);
app.get("/admin/post/member/:activity/accept/:mssv", Guard.isLogin, activityController.getAcceptMember, emailController.registered);
app.get("/admin/post/member/:activity/refuse/:mssv", Guard.isLogin, activityController.getRefuseMember);
// app.post();
app.post("/ajax/delete/image", activityController.postDeleteImage);
app.get("*", (req, res) => { res.render("404"); });

export default app;