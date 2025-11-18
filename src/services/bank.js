import fs from "fs/promises";

export class BankService {
  async getUsers() {
    const data = await fs.readFile("data/users.json", "utf-8");
    return JSON.parse(data);
  }

  async saveUsers(users) {
    await fs.writeFile("data/users.json", JSON.stringify(users));
  }

  async checkBalance(id) {
    const users = await this.getUsers();
    const user = users.find((u) => u.id == id);

    return user.balance;
  }
}
