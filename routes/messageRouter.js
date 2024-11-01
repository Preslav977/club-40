const { Router } = require("express");

const messageRouter = Router();

const messageController = require("../controllers/messageController");

messageRouter.get("/new-message", messageController.newMessageGet);

messageRouter.post("/new-message", messageController.newMessagePost);

messageRouter.get("/delete/:id", messageController.newMessageDeletePost);

module.exports = messageRouter;
