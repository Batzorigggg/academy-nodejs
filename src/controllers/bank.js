import { BankService } from "../services/bank.js";

const bankService = new BankService();

export const checkBalanceController = async (req, res) => {};

export const getHistoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await bankService.getHistory(id);
    res.json(history);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const depositController = async (req, res) => {
  try {
    const { id, amount } = req.body;
    const newBalance = await bankService.deposit(id, amount);
    res.json({ message: "Success", balance: newBalance });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const withdrawController = async (req, res) => {
  try {
    const { id, amount } = req.body;
    const newBalance = await bankService.withdraw(id, amount);
    res.json({ message: "Success", balance: newBalance });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
