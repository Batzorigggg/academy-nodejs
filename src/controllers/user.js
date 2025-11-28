import fs from "node:fs/promises";
import path from "path";

export const login = async (req, res) => {
  const dataPath = path.join(process.cwd(), "/data/user.json");

  console.log(dataPath);
  const { email, password } = req.body;

  const userRawData = await fs.readFile(dataPath, "utf-8");

  const userData = JSON.parse(userRawData);

  const user = userData.find((data) => {
    return data.firstName === email && password === password;
  });

  console.log(user);

  if (!user) {
    throw new Error("User not found");
  }

  res.cookie("user", user.id, {
    httpOnly: true,
    secure: false,
  });

  res.send("Success");
};

export const logout = (req, res) => {
  res.clearCookie("user");

  res.send("Success!");
};
