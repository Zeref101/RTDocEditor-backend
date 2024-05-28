import { Router, Response, Request } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/User.model";
import Session from "../model/session.model";
import { connectToDB } from "../db";

const router = Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Google client ID and secret must be set in environment variables"
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        connectToDB();
        let user = await User.findOne({
          email: profile.emails ? profile.emails[0].value : "",
        });

        if (!user) {
          user = await User.create({
            username: profile.name?.givenName,
            email: profile.emails ? profile.emails[0].value : "",
            avatar: profile.photos ? profile.photos[0].value : "",
            googleAuth: true,
          });
        }

        await Session.create({
          user: user._id,
        });

        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/signIn",
  }),
  function (req, res) {
    console.log(req.user);
    res.redirect("http://localhost:3000/");
  }
);
module.exports = router;
