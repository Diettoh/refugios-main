import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { query } from "../db/client.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "12h";

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email y password son requeridos" });
    }

    const result = await query(
      `SELECT id, full_name, email, role, is_active, password_hash
       FROM app_users
       WHERE email = $1
       LIMIT 1`,
      [String(email).toLowerCase().trim()]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const user = result.rows[0];
    if (user.is_active === false) {
      return res.status(403).json({ error: "Usuario inactivo" });
    }
    if (!user.password_hash) {
      return res.status(401).json({ error: "Usuario sin contraseña configurada" });
    }

    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.full_name
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req, res) => {
  const auth = req.get("authorization") || "";
  const [, rawToken] = auth.split(" ");
  if (!rawToken) {
    return res.status(401).json({ error: "Token requerido" });
  }
  try {
    const decoded = jwt.verify(rawToken, JWT_SECRET);
    return res.json({ user: decoded });
  } catch {
    return res.status(401).json({ error: "Token invalido o expirado" });
  }
});

export default router;

