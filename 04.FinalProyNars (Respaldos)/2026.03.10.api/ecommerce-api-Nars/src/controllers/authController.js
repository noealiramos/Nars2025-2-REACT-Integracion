
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const generateToken = (user) => {
  const payload = { userId: user._id.toString(), displayName: user.displayName, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const register = async (req, res, next) => {
  try {
    const { displayName, email, password, phone, avatar } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() }).lean();
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await hashPassword(password);
    const created = await User.create({
      displayName,
      email,
      hashPassword: hashed,
      phone,
      avatar,
    });

    const token = generateToken(created);
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: created._id,
        displayName: created.displayName,
        email: created.email,
        role: created.role,
        phone: created.phone ?? null,
        avatar: created.avatar ?? null,
        active: created.active,
        createdAt: created.createdAt,
      },
      token,
    });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+hashPassword'); // porque en el schema está select:false

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (user.active === false) return res.status(403).json({ message: 'User is deactivated' });

    const isMatch = await bcrypt.compare(password, user.hashPassword);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    const userOut = {
      id: user._id,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      phone: user.phone ?? null,
      avatar: user.avatar ?? null,
      active: user.active,
      createdAt: user.createdAt,
    };

    return res.status(200).json({ message: 'Login successful', user: userOut, token });
  } catch (error) {
    return next(error);
  }
};
