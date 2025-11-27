export const login = (req, res) => {
  res.cookie("user", "userId123", {
    httpOnly: true,
    secure: false,
  });
  res.json({
    status: 200,
    user: "userId123",
  });
};

export const logout = (req, res) => {
  res.clearCookie("user");

  res.send("Success!");
};
