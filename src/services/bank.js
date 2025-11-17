export class BankService {
  checkBalance() {
    const users = fs.readFile("../../data/users.json").then((value) => {
      const { id } = req.params;
      const users = fs.readFile("users.json").then((value) => {
        return JSON.parse(value);
      });

      const user = users.find((value) => {
        return value.id == id;
      });

      res.json(user);
      return JSON.parse(value);
    });

    const user = users.find((value) => {
      return value.id == id;
    });
  }
}
