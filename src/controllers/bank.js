import { BankService } from "../services/bank.js";

export const checkBalanceController = async (req, res) => {
  const { id } = req.params;
  const users = await fs.readFile("../../data/users.json").then((value) => {
    return JSON.parse(value);
  });

  const user = users.find((value) => {
    return value.id == id;
  });

  res.json(user);

  try {
    const aa = new BankService();

    res.send(aa.checkBalance());
  } catch (e) {
    res.status(500).send(e.message);
  }
};
