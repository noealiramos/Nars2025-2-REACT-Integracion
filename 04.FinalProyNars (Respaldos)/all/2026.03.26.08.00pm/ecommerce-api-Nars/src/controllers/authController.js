
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/user.js';
import RefreshToken from '../models/refreshToken.js';
import { logFailedLogin } from '../middlewares/securityLogger.js';
import { durationToMs } from '../utils/duration.js';

const DEFAULT_REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const generateAccessToken = (user) => {
  const payload = { userId: user._id.toString(), displayName: user.displayName, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });
};

const generateRefreshToken = async (user) => {
  const refreshTtlMs = durationToMs(env.REFRESH_TOKEN_TTL, DEFAULT_REFRESH_TTL_MS);
  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: env.REFRESH_TOKEN_TTL, jwtid: randomUUID() }
  );
  
  // Guardamos en DB para permitir revocación
  await RefreshToken.create({
    user: user._id,
    token: token,
    expiresAt: new Date(Date.now() + refreshTtlMs)
  });

  return token;
};

const hashPassword = async (password) => {
  const saltRounds = 12; // Incrementado para producción de 10 a 12
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

    const accessToken = generateAccessToken(created);
    const refreshToken = await generateRefreshToken(created);

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: created._id,
        displayName: created.displayName,
        email: created.email,
        role: created.role,
        active: created.active,
      },
      accessToken,
      refreshToken
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
      .select('+hashPassword'); 

    if (!user) {
      logFailedLogin(email, req.ip, 'User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.active === false) {
      logFailedLogin(email, req.ip, 'User deactivated');
      return res.status(403).json({ message: 'User is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.hashPassword);
    if (!isMatch) {
      logFailedLogin(email, req.ip, 'Wrong password');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    const userOut = {
      id: user._id,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      active: user.active,
    };

    return res.status(200).json({ 
      message: 'Login successful', 
      user: userOut, 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    return next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' });

    // 1. Verificar si el token existe en DB y no está revocado
    const storedToken = await RefreshToken.findOne({ token: refreshToken, revoked: false });
    if (!storedToken) {
      // Si el token es inválido o ya fue revocado, posible ataque de reutilización
      // Opcional: revocar todos los tokens de este usuario para mayor seguridad
      return res.status(401).json({ message: 'Invalid or revoked refresh token' });
    }

    // 2. Verificar JWT
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.active) return res.status(401).json({ message: 'User not found or inactive' });

    // 3. ROTACIÓN DE TOKEN: Revocar el actual y generar uno nuevo
    storedToken.revoked = true;
    await storedToken.save();

    const accessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    return res.status(200).json({ 
      accessToken, 
      refreshToken: newRefreshToken 
    });
  } catch (error) {
    if (error?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    if (error?.name === 'JsonWebTokenError' || error?.name === 'NotBeforeError') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required for logout' });

    // Revocar el token en la base de datos
    await RefreshToken.updateMany({ token: refreshToken }, { $set: { revoked: true } });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return next(error);
  }
};
