import express, { Request, Response } from "express";
import cors from "cors";
import session, { Store } from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import { connectToDB } from "./db";

require("dotenv").config();

const app = express();

const port = process.env.PORT;
const corsOptions = {
  origin: ["http://localhost:3000"],
  mode: "no-cors",
  methods: "GET, POST, PATCH, PUT, HEAD, DELETE",
  credential: true,
};

app.use(
  session({
    secret: "secrethaibhai",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "GoogleSession",
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 * 7,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const userAuthRoutes = require("./routes/auth.ts");
const userGoogleAuth = require("./routes/googleAuth.ts");
const docRoute = require("./routes/document.ts");
const sessionRoute = require("./routes/session.ts");
const savedDocRoute = require("./routes/savedDocuments");
const collabDocRoute = require("./routes/collab_doc.ts");

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.use("/api/auth/", userAuthRoutes);
app.use("/", userGoogleAuth);
app.use("/api/", docRoute);
app.use("/api/", sessionRoute);
app.use("/api/", savedDocRoute);
app.use("/api/", collabDocRoute);
connectToDB();
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
