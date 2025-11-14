import express from "express";
import fs from "node:fs/promises";
import { stringify } from "node:querystring";

const app = express();

app.use(express.json());

app.get("/login/:id", async (req, res) => {
  const { id } = req.params;
  const users = await fs.readFile("users.json").then((value) => {
    return JSON.parse(value);
  });

  const user = users.find((value) => {
    return value.id == id;
  });

  res.json(user);
});

app.post("/signup", async (req, res) => {
  const users = JSON.parse(await fs.readFile("users.json"));

  const newId = users.length + 1;

  const newUser = {
    id: newId,
    ...req.body,
    // firstName: req.body.firstName,
    // age: req.body.age
  };

  users.push(newUser);

  await fs.writeFile("users.json", JSON.stringify(users));

  res.json(newUser);
});

app.put("/deposit", async (req, res) => {
  const { id } = req.params;

  const users = JSON.parse(await fs.readFile("users.json", "utf-8"));

  const user = users.find((u) => u.id == id);

  req.body.balance = req.body.balance - req.body;

  Object.assign(user, req.body);

  await fs.writeFile("users.json", JSON.stringify(users));

  res.json(user);
});

app.put("/transaction", async (req, res) => {
  const { id } = req.params;
  const { senderId, receiverId, amount } = req.body;

  const users = JSON.parse(await fs.readFile("users.json", "utf-8"));

  const sender = users.find((u) => u.id === senderId);
  const receiver = users.find((u) => u.id === receiverId);

  const amt = Number(amount);

  sender.balance -= amt;
  receiver.balance += amt;

  await fs.writeFile("users.json", JSON.stringify(users));

  res.json({
    sender,
    receiver,
  });
});

app.get("/get-users", async (req, res) => {
  const { id } = req.query;

  const users = await fs.readFile("users.json").then((value) => {
    return JSON.parse(value);
  });

  const filteredUsers = users.filter((value) => {
    return value.id == id;
  });

  res.json(filteredUsers);
});

app.listen(3000, () => {
  console.log("3000");
});
