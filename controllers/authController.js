const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: "Email exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(201).json({ token });
    return;
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Register error" });
    return;
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
    return;
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Login error" });
    return;
  }
};

module.exports = { registerUser, loginUser };
