import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import passport from "passport";
import passportGoogle from "passport-google-oauth";
import User from "../models/User";



const GoogleStrategy = passportGoogle.OAuth2Strategy;

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.email);
});

passport.deserializeUser((user: any, done) => {
    User.findOne({ "email": user.email }, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: "790914908087-ei1im9l1nhcbf2qd1gcdqfde3ub9d1c9.apps.googleusercontent.com",
    clientSecret: "8QEKd0jy5coEI_uNsSwCvRQd",
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    if (profile) {
        console.log("# passport.ts done returning");
        return done(undefined, {
            auth: {
                googleId: profile.id,
                picture: profile.photos[0].value,
                displayName: profile.displayName
            },
            email: profile.emails[0].value,
            fullName: profile.displayName
        });
    }
    else
        return done(new Error("Request to Google Auth error"));
}
));


export let isGoogleAuthenticated = passport.authenticate("google", { failureRedirect: "/auth/google" });

/**
 * Login Required middleware.
 */
export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/intro");
};

/**
 * Authorization Required middleware.
 */
export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];

    if (_.find(req.user.tokens, { kind: provider })) {
        next();
    } else {
        res.redirect(`/auth/${provider}`);
    }
};

export default passport;