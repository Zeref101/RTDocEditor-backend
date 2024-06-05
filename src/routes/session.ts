import express from "express";
import Session from "../model/session.model";

const router = express.Router();

router.get("/sessions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const session = await Session.findById(id).populate("user");
    if (!session) return res.status(404).send("Session not found");
    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
