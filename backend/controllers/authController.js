const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Name, email, and password are required."
    });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role: role || "Agent"
      }
    });

    const { password_hash: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: "User registered successfully."
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Email already exists."
      });
    }
    res.status(500).json({
      success: false,
      data: null,
      message: "An error occurred during registration."
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Email and password are required."
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid credentials."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid credentials."
      });
    }

    const { password_hash: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
      message: "Login successful."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "An error occurred during login."
    });
  }
};
