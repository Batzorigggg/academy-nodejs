import { Router } from "express";

export const bankRouters = new Router();

bankRouters.post("/deposit", (req, res) => {
  console.log(req.user);

  if (!req.user) {
    res.send("Newtreegui bn");
  }
  res.send("success");
});

// import express from "express";
// import {
//   checkBalanceController,
//   getHistoryController,
//   depositController,
//   withdrawController,
// } from "../controllers/bank.js";

// export const bankRouter = new express.Router();

// bankRouter.get("/check-balance/:id", checkBalanceController);

// bankRouter.get("/history/:id", getHistoryController);

// bankRouter.post("/deposit", depositController);

// bankRouter.post("/withdraw", withdrawController);
