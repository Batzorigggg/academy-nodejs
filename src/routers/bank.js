import express from "express";
import {
  checkBalanceController,
  getHistoryController,
  depositController,
  withdrawController
} from "../controllers/bank.js";

export const bankRouter = new express.Router();

bankRouter.get("/check-balance/:id", checkBalanceController);

bankRouter.get("/history/:id", getHistoryController);

bankRouter.post("/deposit", depositController);

bankRouter.post("/withdraw", withdrawController);