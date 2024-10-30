const { Router } = require("express");

const userRouter = Router();

const userController = require("../controllers/userController");

userRouter.get("/sign-up", userController.userCreateGet);

userRouter.post("/sign-up", userController.userCreatePost);

userRouter.get("/log-in", userController.userLogInGet);

userRouter.post("/log-in", userController.userLogInPost);

userRouter.get("/become-member", userController.userBecomeMemberGet);

userRouter.post("/become-member", userController.userBecomeMemberPost);

userRouter.get("/become-admin", userController.userBecomeAdminGet);

userRouter.post("/become-admin", userController.userBecomeAdminPost);

module.exports = userRouter;
