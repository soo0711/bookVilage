const db = require("./db");
const bcrypt = require("bcrypt"); // 비밀번호 암호화

exports.registerUser = async (req, res) => {
  const { loginId, password, name, email, phoneNumber } = req.body;


  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO Users (loginId, password, name, email, phoneNumber) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [loginId, hashedPassword, name, email, phoneNumber],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "DB Error", details: err });
      }
      res.status(201).json({ message: "User registered successfully!" });
    }
  );
};

exports.loginUser = (req, res) => {
  const { loginId, password } = req.body;

  const query = "SELECT * FROM user WHERE loginId = ?";
  db.query(query, [loginId], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "DB Error", details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
};
