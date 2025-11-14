import fs from "node:fs/promises";
import inquirer from "inquirer";
import express from "express";

const getUsers = async () => {
  const userRawData = await fs.readFile("users.json", "utf-8");

  const users = JSON.parse(userRawData);

  return users;
};

const login = async () => {
  const { username, password } = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Enter your username",
    },
    {
      type: "password",
      name: "password",
      message: "Enter your password",
    },
  ]);

  const users = await getUsers();

  const user = users.find((value) => {
    return value.username === username && value.password === password;
  });

  if (!user) {
    console.log("username eswel password buruu bn!");
    await auth();
  } else {
    return bankAnswer(users, user);
  }
};

const signup = async () => {
  const { username, password, passwordVerify } = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Enter your username",
    },
    {
      type: "password",
      name: "password",
      message: "Enter your password",
    },
    {
      type: "password",
      name: "passwordVerify",
      message: "Enter your password again",
    },
  ]);

  if (password !== passwordVerify) {
    console.log("Password validation failed!");
    return signup();
  }

  const users = await getUsers();

  const user = users.find((value) => {
    return value.username === username;
  });

  if (user) {
    console.log("Username not valid");
    return signup();
  }

  users.push({ username, password, balance: 0 });

  const userData = JSON.stringify(users);

  await fs.writeFile("users.json", userData, "utf-8");

  console.log("Amjilttai burtguulle!");

  return login();
};

const auth = async () => {
  const { authOption } = await inquirer.prompt([
    {
      type: "select",
      name: "authOption",
      message: "Login Or Signup",
      choices: ["Login", "Signup"],
    },
  ]);

  if (authOption === "Login") {
    return login();
  } else {
    return signup();
  }
};

auth();

const bankAnswer = async (users, user) => {
  const { bankOption } = await inquirer.prompt([
    {
      type: "select",
      name: "bankOption",
      message: "Login Or Signup",
      choices: [
        { name: "Deposit", value: "deposit" },
        { name: "Withdraw", value: "withdraw" },
        { name: "History all", value: "history-all" },
        { name: "History deposit", value: "history-deposit" },
        { name: "History withdraw", value: "history-withdraw" },
        { name: "Check balance", value: "check-balance" },
        { name: "Transaction", value: "transaction" },
        { name: "Exit", value: "exit" },
      ],
    },
  ]);

  switch (bankOption) {
    case "deposit":
      await deposit(users, user);
      break;
    case "withdraw":
      await withdraw(users, user);
      break;
    case "history-all":
      await allhistory(users, user);
      break;
    case "history-deposit":
      await dephistory(users, user);
      break;
    case "history-withdraw":
      await withhistory(users, user);
      break;
    case "check-balance":
      await check(users, user);
      break;

    case "transaction":
      await transaction(users, user);
      break;
    case "exit":
      process.exit();
  }
};

const updateUser = async (users, user, amount, type) => {
  const userData = JSON.stringify(users);

  await fs.writeFile("users.json", userData, "utf-8");

  const historyRawData = await fs.readFile("history.json", "utf-8");
  const history = JSON.parse(historyRawData);

  const userHistories = history[user.username] || [];

  userHistories.push({
    type,
    amount,
    balance: user.balance,
    currentBalance: 0,
  });

  history[user.username] = userHistories;

  const historyData = JSON.stringify(history);

  await fs.writeFile("history.json", historyData, "utf-8");
  console.log("Amjilttai");

  return;
};

const deposit = async (users, user) => {
  let balance = parseInt(user.balance) || 0;

  const { amount } = await inquirer.prompt([
    {
      type: "number",
      name: "amount",
      message: "Hediin orlogo hiih we?",
    },
  ]);

  balance = balance + amount;

  user.balance = balance;

  return await updateUser(users, user, amount, "deposit");
};

const withdraw = async (users, user) => {
  let balance = parseInt(user.balance);
  const { amount } = await inquirer.prompt([
    {
      type: "number",
      name: "amount",
      message: "Heden tugrug avah ve?",
    },
  ]);

  if (amount > balance) {
    console.log("Uldegdel hureltsehgui baina");
    return;
  }

  balance = balance - amount;

  user.balance = balance;

  return await updateUser(users, user, amount, "withdraw");
};

const allhistory = async (users, user) => {
  {
    const historyRawData = await fs.readFile("history.json", "utf-8");

    const history = JSON.parse(historyRawData);

    const userHistories = history[user.username];

    for (let i = 0; i < userHistories.length; i++) {
      const a = userHistories[i];
      console.log(`${a.type}: ${a.amount}  Balance: ${a.balance}`);
    }
  }
};

const dephistory = async (users, user) => {
  const userRawData = await fs.readFile("history.json", "utf8");

  const history = JSON.parse(userRawData);

  const userHistories = history[user.username];

  for (let i = 0; i < userHistories.length; i++) {
    const a = userHistories[i];
    if (a.type === "deposit") {
      console.log(`Deposit: ${a.amount} Balance: ${a.balance}`);
    }
  }
};

const withhistory = async (users, user) => {
  const userRawData = await fs.readFile("history.json", "utf8");

  const history = JSON.parse(userRawData);

  const userHistories = history[user.username];

  for (let i = 0; i < userHistories.length; i++) {
    const a = userHistories[i];
    if (a.type === "withdraw") {
      console.log(`Withdraw: ${a.amount} Balance: ${a.balance}`);
    }
  }
};

const check = async (users, user) => {
  const userRawData = await fs.readFile("users.json", "utf8");

  const userData = JSON.parse(userRawData);

  const a = users.find((value) => {
    return value.username === user.username;
  });
  console.log(`Tanii dansnii uldegdel: ${a.balance}`);
};

const transaction = async (users, user) => {
  const { avahName } = await inquirer.prompt([
    {
      type: "input",
      name: "avahName",
      message: "Hen ruu mungu shiljuuleh ve?",
    },
  ]);

  const { amount } = await inquirer.prompt([
    {
      type: "number",
      name: "amount",
      message: "Hediig shiljuuleh ve?",
    },
  ]);

  let sender;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === user.username) {
      sender = users[i];
      break;
    }
  }

  if (amount > sender.balance) {
    console.log("Uldegdel hureltsehgui baina");
    return;
  }

  let receiver;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === avahName) {
      receiver = users[i];
      break;
    }
  }

  if (!receiver) {
    console.log("Tiim hun burtgelgui baina");
    return;
  }

  sender.balance = sender.balance - amount;
  receiver.balance = receiver.balance + amount;

  console.log(`${amount} shiljuullee`);

  await updateUser(users, sender, amount, "transfer-out");
  await updateUser(users, receiver, amount, "transfer-in");
};
