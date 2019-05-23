import passport from "passport";
import passportGoogle from "passport-google-oauth";
import User from "../models/User";
import { Role } from "../models/User";
import { CLIENT_ID, CLIENT_SECRET } from "../util/secrets";

const GoogleStrategy = passportGoogle.OAuth2Strategy;

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.email);
});

passport.deserializeUser((user: any, done) => {
    User.findOne({ email: user, isBlock: { $not: { $eq: true } } }, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    if (profile) {
        // if (profile._json.hd != "hcmut.edu.vn") return done(new Error("Bạn phải là sinh viên Bách khoa để truy cập trang này"), false);

        return done(undefined, {
            auth: {
                googleId: profile.id,
                picture: profile.photos[0].value,
                displayName: profile.displayName
            },
            email: profile.emails[0].value,
            fullName: profile.displayName,
            avatar: profile.photos[0].value,
            code: /^\d+$/.test(profile.emails[0].value.substr(0, 7)) ? profile.emails[0].value.substr(0, 7) : undefined,
            role: profile.emails[0].value[6] == "@" ? Role.Host : Role.Student,
            socialdays: { lastUpdate: 0 }
        });
    }
    else
        return done(new Error("Request to Google Auth error"));
}
));


export let isGoogleAuthenticated = passport.authenticate("google", { failureRedirect: "/auth/google" });
export default passport;

// /**
//  * Login Required middleware.
//  */
// export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/intro");
// };

// /**
//  * Authorization Required middleware.
//  */
// export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {
//     const provider = req.path.split("/").slice(-1)[0];

//     if (_.find(req.user.tokens, { kind: provider })) {
//         next();
//     } else {
//         res.redirect(`/auth/${provider}`);
//     }
// };

