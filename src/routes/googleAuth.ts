import { Router, Response, Request } from "express";
import passport, { session } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/User.model";
import UserSession from "../model/session.model";
import { connectToDB } from "../db";
import { ObjectId } from "mongodb";
import Document from "../model/Document.model";

export interface SessionCookie {
  user: ObjectId;
  _id: ObjectId;
  expiresAt: Date;
  __v: number;
}

export interface User {
  username: string;
  email: string;
  avatar: string;
  googleAuth: boolean;
  _id: ObjectId;
  __v: number;
}

export interface ReqUser {
  user: User;
  session: SessionCookie;
}

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

          const personalDocument = await Document.create({
            content: "",
            title: "Personal",
            owner: user._id,
            lastModified: new Date(),
          });

          user.personal = personalDocument._id;
          await user.save();
        }

        const session = await UserSession.create({
          user: user._id,
        });

        return cb(null, { user, session });
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
    failureRedirect: "http://localhost:3000/signUp",
  }),
  function (req: Request, res: Response) {
    if (!req.user) {
      console.error("User information is not available in the request.");
      res.redirect("http://localhost:3000/signUp");
      return;
    }

    const user = req.user as ReqUser;
    const sessionCookie = user.session;
    console.log(sessionCookie);

    if (!sessionCookie) {
      console.error("Session information is not available in the user object.");
      res.redirect("http://localhost:3000/signUp");
      return;
    }

    if (!sessionCookie._id) {
      console.error("Session ID is not available in the session object.");
      res.redirect("http://localhost:3000/signUp");
      return;
    }
    res.cookie("pookie", sessionCookie._id.toString(), { maxAge: 604800000 });
    res.redirect("http://localhost:3000/");
  }
);
module.exports = router;
