// server.mjs (หรือ index.mjs)
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import router from "./src/routes/userRoutes.js";
import { initMiddleware } from "./src/middlewares/middleware.js";
import { requireAuth } from "./src/middlewares/auth.js";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
// import cors from "cors";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


initMiddleware(app);
// ให้ frondend เข้ามาเรียกใช้งานได้
// app.use(cors({
//   origin: "http://localhost:3000", // เว็บที่คุณรัน HTML
//   credentials: true
// }));

// Serve the /page folder behind auth: any request to /page/* will go through requireAuth
app.use('/page', requireAuth, express.static(path.join(__dirname, 'public', 'page')));

// Serve other public static files (css, js, images, root index.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));


app.use('/.well-known/appspecific/com.chrome.devtools.json', (req, res, next) => {
 
  res.status(204).end();
});

app.use("/", router); // mount routes


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

