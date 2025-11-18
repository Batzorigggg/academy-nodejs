import { BankService } from "../services/bank.js";

const bankService = new BankService();

export const checkBalanceController = async (req, res) => {
  try {
    const { id } = req.params;

    const balance = await bankService.checkBalance(id);

    res.json({ balance });
  } catch (e) {
    res.json(e);
  }
};
