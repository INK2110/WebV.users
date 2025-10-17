import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import pool from "../dbConfig/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }
    next();
}

export const redirectIfAuth = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/main');
  }
  next(); // ถ้ายังไม่ล็อกอิน ให้ผ่านไปได้ (เพื่อให้เห็นหน้าฟอร์ม)
};



export const authGuard = (req, res, next) => {
    // Allow some public paths (login-related and API)
    const openPaths = ["/", "/login", "/logout", "/getUser"];
    // Allow static asset prefixes (so css/js/images load without auth)
    const openPrefixes = ["/css", "/js", "/images", "/img", "/assets", "/fonts", "/favicon.ico"];
    if (openPaths.includes(req.path) || openPrefixes.some(p => req.path.startsWith(p))) {
      return next(); // allow index, login and static assets
    }
    
    return requireAuth(req, res, next);
};

const PgSession = connectPgSimple(session);
export const sessionMiddleware = session({
  store: new PgSession({ 
    pool, 
    tableName: "session", 
    createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || "dev-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { 
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 },
      
});

export const attachUser = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;

  }
  next();
};


export const requireRole = (...Role) => {
  //  if (!req.session || !req.session.user)
  //     return res.redirect('/');
   
  //  if (Role.includes(req.user.rolename)){
  //     res.send("คุณมีสิทธิ์เข้าใช้งานหน้านี้");
  //  }
 };