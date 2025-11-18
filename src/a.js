const name = document.getElementById("name");
const pass = document.getElementById("password");
document.getElementById("btn").addEventListener("click", async () => {});
const response = fetch("http://localhost:3000/user/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name, pass }),
});

console.log(response, "response");
