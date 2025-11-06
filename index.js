import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function readUsers() {
  if (!fs.existsSync("users.txt")) return [];
  const data = fs.readFileSync("users.txt", "utf-8").trim();
  if (data === "") return [];

  return data.split("\n").map((line) => {
    const [username, pin, balance] = line.split(",");
    return { username: username.trim(), pin: pin.trim(), balance: parseInt(balance.trim()) };
  });
}

function writeUsers(users) {
  const lines = users.map((u) => `${u.username},${u.pin},${u.balance}`);
  fs.writeFileSync("users.txt", lines.join("\n"));
}

function logTransaction(username, type, amount) {
  const log = `${new Date().toLocaleString()} - ${username} - ${type} - ${amount}\n`;
  fs.appendFileSync("transactions.txt", log);
}

function register() {
  const users = readUsers();

  rl.question("👤 Нэвтрэх нэрээ оруулна уу: ", (username) => {
    const existing = users.find((u) => u.username === username);
    if (existing) {
      console.log("⚠️ Энэ нэртэй хэрэглэгч аль хэдийн бүртгэгдсэн байна!");
      return rl.close();
    }

    rl.question("🔑 PIN код: ", (pin) => {
      rl.question("💰 Эхний үлдэгдэл: ", (balanceStr) => {
        const balance = parseInt(balanceStr);
        const newUser = { username, pin, balance };
        users.push(newUser);
        writeUsers(users);
        console.log("✅ Амжилттай бүртгэгдлээ!");
        rl.close();
      });
    });
  });
}

function login() {
  const users = readUsers();

  rl.question("👤 Нэвтрэх нэр: ", (username) => {
    rl.question("🔑 PIN код: ", (pin) => {
      const user = users.find((u) => u.username === username && u.pin === pin);

      if (!user) {
        console.log("❌ Нэвтрэх нэр эсвэл PIN буруу байна!");
        rl.close();
      } else {
        console.log(`\n✅ Сайн байна уу, ${username}!`);
        showMenu(user);
      }
    });
  });
}

// =======================
// showMenu(): хэрэглэгчийн цэс
// =======================
function showMenu(user) {
  console.log(`
==== ATM MENU ====
1. Үлдэгдэл шалгах
2. Мөнгө нэмэх
3. Мөнгө авах
4. Гарах
`);

  rl.question("➡️ Сонголтоо оруулна уу: ", (choice) => {
    const users = readUsers();
    const current = users.find((u) => u.username === user.username);

    switch (choice) {
      case "1":
        console.log(`💰 Таны үлдэгдэл: ${current.balance}₮`);
        return showMenu(current);

      case "2":
        rl.question("➕ Нэмэх дүн: ", (amountStr) => {
          const amount = parseInt(amountStr);
          current.balance += amount;
          writeUsers(users);
          logTransaction(current.username, "deposit", amount);
          console.log(`✅ ${amount}₮ нэмэгдлээ! Шинэ үлдэгдэл: ${current.balance}₮`);
          return showMenu(current);
        });
        break;

      case "3":
        rl.question("➖ Авах дүн: ", (amountStr) => {
          const amount = parseInt(amountStr);
          if (amount > current.balance) {
            console.log("Үлдэгдэл хүрэлцэхгүй!");
            return showMenu(current);
          }
          current.balance -= amount;
          writeUsers(users);
          logTransaction(current.username, "withdraw", amount);
          console.log(`${amount}₮ авлаа! Үлдэгдэл: ${current.balance}₮`);
          return showMenu(current);
        });
        break;

      case "4":
        console.log("Garlaa");
        rl.close();
        break;

      default:
        console.log("Буруу сонголт!");
        return showMenu(current);
    }
  });
}

console.log(`
==== ATM SYSTEM ====
1. Нэвтрэх
2. Бүртгүүлэх
`);

rl.question("Сонголтоо оруулна уу: ", (startChoice) => {
  if (startChoice === "1") {
    login();
  } else if (startChoice === "2") {
    register();
  } else {
    console.log("⚠️ Буруу сонголт!");
    rl.close();
  }
});
