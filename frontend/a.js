const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const nameInput = document.getElementById("name");
const passInput = document.getElementById("password");
const historyBody = document.getElementById("historyBody");
const amountInput = document.getElementById("amountInput");

let currentUserId = null;

document.getElementById("btnLogin").addEventListener("click", async (e) => {
  e.preventDefault();
  const name = nameInput.value;
  const pass = passInput.value;

  try {
    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pass }),
    });

    const data = await response.json();

    if (response.ok) {
      currentUserId = data.userId;

      document.getElementById("userDisplay").innerText = name;
      loginSection.classList.add("hidden");
      dashboardSection.classList.remove("hidden");

      loadHistory();
    } else {
      document.getElementById("errorMsg").innerText =
        data.error || "Login failed";
    }
  } catch (error) {
    console.error(error);
  }
});

async function loadHistory() {
  const res = await fetch(
    `http://localhost:3000/bank/history/${currentUserId}`
  );
  const history = await res.json();

  historyBody.innerHTML = "";
  if (Array.isArray(history)) {
    history.forEach((item) => {
      const row = `
                <tr>
                    <td>${item.date || new Date().toLocaleDateString()}</td>
                    <td>${item.type}</td>
                    <td>${item.amount}</td>
                </tr>
            `;
      historyBody.innerHTML += row;
    });
  }
}

async function handleTransaction(type) {
  const amount = Number(amountInput.value);
  if (!amount) return alert("Please enter amount");

  const endpoint = type === "deposit" ? "deposit" : "withdraw";

  const res = await fetch(`http://localhost:3000/bank/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: currentUserId, amount: amount }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Transaction Successful! New Balance: " + data.balance);
    loadHistory();
    amountInput.value = "";
  } else {
    alert("Error: " + data.error);
  }
}

document
  .getElementById("btnDeposit")
  .addEventListener("click", () => handleTransaction("deposit"));
document
  .getElementById("btnWithdraw")
  .addEventListener("click", () => handleTransaction("withdraw"));

document.getElementById("btnLogout").addEventListener("click", () => {
  location.reload();
});
