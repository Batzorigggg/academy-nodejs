import fs from "node:fs/promises";
import inquirer from "inquirer";

const { username, password } = await inquirer.prompt([
  {
    type: "input",
    name: "username",
    message: "Neree oruulna uu",
  },
  {
    type: "password",
    name: "password",
    message: "password oruulna uu",
  },
  // {
  //   type: "select",
  //   name: "action",
  //   choices: ["Deposit", "Withdraw"],
  //   message: "Ymar uildel hiih we"
  // }
]);

const userRawData = await fs.readFile("users.json", "utf8");

const users = JSON.parse(userRawData);

const user = users.find((value) => {
  return value.name == username && value.password == password;
});

if (!user) {
  console.log("ner eswel nuuts ug buruu bn!");

  process.exit();
}

const historyRawData = await fs.readFile("history.json", "utf8");

const history = JSON.parse(historyRawData);

if (!history[user.name]) {
  history[user.name] = [];
}

history[user.name].push({ amount: 1000, action: "deposit" });

const historyString = JSON.stringify(history);

fs.writeFile("history.json", historyString)
  .then(() => {
    console.log("Amjilttai nevterlee!");
    process.exit();
  })
  .catch((e) => {
    console.log(e);
    console.log("aldaa garlaa");
  });
