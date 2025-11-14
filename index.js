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

  res.json(user);
});

app.get("/get-users", async (req, res) => {
  const { firstName, age } = req.query;

  const users = await fs.readFile("users.json").then((value) => {
    return JSON.parse(value);
  });

  const filteredUsers = users.filter((value) => {
    return value.firstName === firstName && value.age == age;
  });

  res.json(filteredUsers);
});


app.post("/create-user", async (req, res) => {
  const users = JSON.parse(await fs.readFile("users.json"));

  const newId = users.length + 1;

  const newUser = {
    id: newId,
    ...req.body,
    // firstName: req.body.firstName,
    // age: req.body.age
  }


  users.push(newUser);

  await fs.writeFile("users.json", JSON.stringify(users));

  res.json(newUser);
});


app.put("/update-user/:id", async (req, res) => {
  const { id } = req.params;

  const users = JSON.parse(await fs.readFile("users.json", "utf-8"));

  const user = users.find(u => u.id == id);

  Object.assign(user, req.body);

  await fs.writeFile("users.json", JSON.stringify(users));

  res.json(user);
});


app.listen(3000, () => {
  console.log("3000");
});
