import fs from "fs/promises";
const DATA_FILE = "data/users.json";

export class BankService {
  async getUsers() {
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveUsers(users) {
    await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
  }

  async checkBalance(id) {
    const users = await this.getUsers();
    const user = users.find((u) => u.id == id);

    if (!user) throw new Error("User not found");

    return user.balance || 0;
  }

  async getHistory(id) {
    const users = await this.getUsers();
    const user = users.find((u) => u.id == id);

    if (!user) throw new Error("User not found");

    return user.history || [];
  }

  async deposit(id, amount) {
    const users = await this.getUsers();
    const index = users.findIndex((u) => u.id == id);

    if (index === -1) throw new Error("User not found");

    users[index].balance = (users[index].balance || 0) + Number(amount);

    const transaction = {
      type: "Deposit",
      amount: Number(amount),
      date: new Date().toLocaleString(),
    };

    if (!users[index].history) {
      users[index].history = [];
    }
    users[index].history.push(transaction);

    await this.saveUsers(users);

    return users[index].balance;
  }

  async withdraw(id, amount) {
    const users = await this.getUsers();
    const index = users.findIndex((u) => u.id == id);

    if (index === -1) throw new Error("User not found");

    const currentBalance = users[index].balance || 0;

    if (currentBalance < amount) {
      throw new Error("Insufficient funds (Үлдэгдэл хүрэлцэхгүй байна)");
    }

    users[index].balance = currentBalance - Number(amount);
    const transaction = {
      type: "Withdraw",
      amount: Number(amount),
      date: new Date().toLocaleString(),
    };

    if (!users[index].history) {
      users[index].history = [];
    }
    users[index].history.push(transaction);

    await this.saveUsers(users);

    return users[index].balance;
  }
}