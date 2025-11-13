import express from "express";
import fs from "node:fs/promises";

const app = express();

app.use(express.json());

app.get("/get-user/:id", async (req, res) => {
  const { id } = req.params;
  const users = await fs.readFile("users.json").then((value) => {
    return JSON.parse(value);
  });

  const user = users.find((value) => {
    return value.id == id;
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.json(user);
});

app.get("/get-users", async (req, res) => {
  const { firstName, age } = req.query;

  const users = await fs.readFile("users.json").then((value) => {
    return JSON.parse(value);
  });

  const filteredUsers = users.filter((value) => {
    return value.firstName === firstName && value.age == age;
  }); //1

  res.json(users);
});

app.post("/create-user", async (req, res) => {
  console.log(req.body);
  res.send("Success"); //2
});

app.put("/update-user/:id", async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.send("Success"); //3
});

app.listen(3000, () => {
  console.log("3000");
});
