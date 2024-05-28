import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const corsOptions = {
  origin: "*",
  methods: "GET, POST, PATCH, PUT, HEAD, DELETE",
  credential: true,
};

app.use(
  session({
    secret: "secrethaibhai",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const userAuthRoutes = require("./routes/auth.ts");
const userGoogleAuth = require("./routes/googleAuth.ts");

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.use("/api/auth/", userAuthRoutes);
app.use("/", userGoogleAuth);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
