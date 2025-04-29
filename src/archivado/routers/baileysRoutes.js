const express = require("express");
const router = express.Router();
const {
  startSession,
  sendMessage,
  getStatus,
} = require("../controllers/baileysController");

router.post("/start", startSession);
router.post("/send", sendMessage);
router.get("/status", getStatus);

module.exports = router;
