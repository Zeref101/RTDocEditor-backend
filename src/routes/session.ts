import express from "express";
import UserSession from "../model/session.model";
import { connectToDB } from "../db";

const router = express.Router();

router.get("/sessions/:id", async (req, res) => {
  try {
    connectToDB();
    const id = req.params.id;
    const session = await UserSession.findById(id).populate("user");
    if (!session) return res.status(404).send("Session not found");
    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
