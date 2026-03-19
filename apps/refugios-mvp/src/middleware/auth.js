import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

/** Rutas que no requieren JWT (path puede tener base path o barra final) */
function isPublicPath(path) {
  const p = (path || "").replace(/\/$/, ""); // quitar barra final
  return (
    p === "/api/auth/login" ||
    p === "/api/health/db" ||
    p === "/api/public-url" ||
    p.endsWith("/api/auth/login") ||
    p.endsWith("/api/health/db") ||
    p.endsWith("/api/public-url")
  );
}

/**
 * Middleware: verifica JWT en Authorization y asigna req.user.
 * Para /api/auth/login, /api/health/db y /api/public-url no exige token.
 * Nota: al montar en app.use("/api", ...), req.path es relativo ("/auth/login");
 * usamos baseUrl + path para obtener la ruta completa.
 */
export function requireAuth(req, res, next) {
  const fullPath = (req.baseUrl || "") + (req.path || "");
  if (isPublicPath(fullPath)) {
    return next();
  }

  const auth = req.get("authorization") || "";
  const [, rawToken] = auth.split(" ");
  if (!rawToken) {
    return res.status(401).json({ error: "Token requerido. Inicia sesión." });
  }

  try {
    const decoded = jwt.verify(rawToken, JWT_SECRET);
    req.user = decoded; // { sub, email, role, name }
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado. Vuelve a iniciar sesión." });
  }
}

/**
 * Middleware que debe ir después de requireAuth.
 * Restringe por rol: solo permite roles en el array (ej. ['admin', 'operator']).
 */
export function requireRole(...allowedRoles) {
  const set = new Set(allowedRoles);
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    if (!set.has(req.user.role)) {
      return res.status(403).json({ error: "No tienes permiso para esta acción" });
    }
    next();
  };
}
