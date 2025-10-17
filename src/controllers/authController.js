import pool from "../dbConfig/db.js";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url));

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email : " ,email);
  try {
    const q = `
      SELECT 
        u.usersid,
        u.firstname,
        u.lastname,
        t.teamname,
        r.rolename,
        d.departmentname,
        u.ispasswordchange
      FROM users u
      JOIN role r ON u.roleid = r.roleid
      JOIN teams t ON u.teamid = t.teamid
      JOIN department d ON t.departmentid = d.departmentid
      WHERE u.usersemail = $1
        AND u.password = crypt($2, u.password)
      LIMIT 1;
    `;

    const { rows } = await pool.query(q, [email, password]);
    
    
    if (rows.length === 0) {
      return res.status(401).send("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกระงับ");
    }

    const u = rows[0];
    req.session.user = {
      usersid: u.usersid,
      firstname: u.firstname,
      lastname: u.lastname,
      teamname : u.teamname,
      departmentname: u.departmentname,
      rolename: u.rolename,
      ispasswordchange: u.ispasswordchange,
    };

    console.log('ข้อมูล Session User:', req.user);
  if(u.ispasswordchange === false){
    const filePath = path.join(__dirname, "../../public/page/newPassword.html");
    return res.sendFile(filePath);
  }
  return res.redirect("/main");
  } catch (e) {
    console.error(e);
    res.status(500).send("เกิดข้อผิดพลาดภายในระบบ");
  }
};

export const changePassword = async (req, res) => {
  const { confirm_password } = req.body;
  const q = `
    UPDATE users
    SET password = crypt($1, gen_salt('bf')),
        ispasswordchange = true
    WHERE usersid = $2
  `;
  const {rows} = await pool.query(q,[confirm_password, req.session.user.usersid]);
  req.session.user.ispasswordchange = true;
  console.log('ข้อมูล Session User:', req.user);
  return res.redirect("/main");
};