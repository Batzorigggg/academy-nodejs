import { BankService } from "../services/bank.js";

const bankService = new BankService();

export const login = async (req, res) => {
  try {
    const { name, pass } = req.body;

    const users = await bankService.getUsers();
    console.log("Users read from file:", users);
    const foundUser = users.find(user => user.firstName == name && user.password == pass);

    if (foundUser) {
      res.json({ message: "Success", userId: foundUser.id });
    } else {
      res.status(401).json({ error: "Username or Password incorrect" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const register = (req, res) => {
  res.send("Register not implemented yet");
};