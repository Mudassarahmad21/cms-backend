// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
// };

// exports.register = async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;
//         const existing = await User.findOne({ email });
//         if (existing) return res.status(400).json({ message: "User already exists" });

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const user = await User.create({
//             name, email, password: hashedPassword, 
//             role: role ? role.toUpperCase() : "CLIENT"
//         });

//         res.status(201).json({
//             success: true,
//             token: generateToken(user._id),
//             user: { id: user._id, name: user.name, role: user.role }
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }
//         res.json({
//             success: true,
//             token: generateToken(user._id),
//             user: { id: user._id, name: user.name, role: user.role }
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const allowedRoles = ["ADMIN", "FARMER", "BROKER", "CLIENT"];
    const userRole = role ? role.toUpperCase() : "CLIENT";

    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
