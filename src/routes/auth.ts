import { Request, Response, Router } from "express";
import { connectToDB } from "../db";
import User from "../model/User.model";
import bcrypt from "bcrypt";
import UserSession from "../model/session.model";
import { SessionCookie } from "./googleAuth";
const router = Router();

router.post("/signUp", async (req: Request, res: Response) => {
  try {
    connectToDB();

    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      email: email,
      username: username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

router.post("/signIn", async (req: Request, res: Response) => {
  try {
    connectToDB();

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const session: SessionCookie = await UserSession.create({
      user: user._id,
    });
    res.cookie("pookie", `${JSON.stringify(session._id)}`);

    return res.status(200).end();

    // return res.cookie("pookie", `${JSON.stringify(session._id)}`);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

module.exports = router;
