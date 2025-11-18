import express from "express";
import { login, register } from "../controllers/user.js";

export const userRouter = new express.Router();

userRouter.post("/login", login);

userRouter.post("/register", register);

userRouter.post("/logout", (req, res) => {
  res.send("Success!");
});
