import pool from "../dbConfig/db.js";


export const getProblemlist = async (req, res) =>  {
  

  try {
    const result = await pool.query(`
      SELECT 
        p.problemid,
        p.title,
        p.description,
        p.createat,
        p.location,
        CONCAT (u.firstname, ' ', u.lastname) AS createby,
        c.categoryname,
        s.statusstate,
        d.departmentname,
        sla.prioritylevel,
        p.comment
      FROM Problem p
      JOIN Users u ON p.createby = u.usersid
      JOIN Category c ON p.categoryid = c.categoryid
      JOIN Status s ON p.statusid = s.statusid
      JOIN Department d ON p.departmentid = d.departmentid
      JOIN ServiceLevelAgreement sla ON p.priorityid = sla.priorityid
      ORDER BY p.problemid DESC;`);

    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ดึงข้อมูลแบบ pagination + filter status
// export const getProblemlistPaginate = async (req, res) => {
//   try {
//     let { page = 1, status = "all" } = req.query;
//     page = parseInt(page);
//     const limit = 10;
//     const offset = (page - 1) * limit;

//     let whereClause = "";
//     const params = [];

//     if (status && status !== "all") {
//       whereClause = `WHERE s.statusstate = $1`;
//       params.push(status);
//     }

//     // ดึงจำนวน total items
//     const totalResult = await pool.query(`
//       SELECT COUNT(*) 
//       FROM Problem p
//       JOIN Status s ON p.statusid = s.statusid
//       ${whereClause};
//     `, params);
//     const totalItems = parseInt(totalResult.rows[0].count);
//     const totalPages = Math.ceil(totalItems / limit);

//     // ดึงข้อมูลแต่ละหน้า
//     const result = await pool.query(`
//       SELECT 
//         p.problemid,
//         p.title,
//         p.description,
//         p.createat,
//         p.location,
//         CONCAT(u.firstname, ' ', u.lastname) AS createby,
//         c.categoryname,
//         s.statusstate,
//         d.departmentname,
//         sla.prioritylevel,
//         p.comment
//       FROM Problem p
//       JOIN Users u ON p.createby = u.usersid
//       JOIN Category c ON p.categoryid = c.categoryid
//       JOIN Status s ON p.statusid = s.statusid
//       JOIN Department d ON p.departmentid = d.departmentid
//       JOIN ServiceLevelAgreement sla ON p.priorityid = sla.priorityid
//       ${whereClause}
//       ORDER BY p.problemid DESC
//       LIMIT $${params.length + 1} OFFSET $${params.length + 2};
//     `, [...params, limit, offset]);

//     res.json({
//       data: result.rows,
//       totalItems,
//       totalPages,
//       currentPage: page
//     });

//   } catch (err) {
//     console.error("Database error:", err);
//     res.status(500).json({ error: "Database error" });
//   }
// };

export const getProblemlastest = async (req, res) =>  {
  
  try {
    const result = await pool.query(`
      SELECT 
        p.problemid,
        p.title,
        p.description,
        p.description,
        p.createat,
        p.location,
        CONCAT (u.firstname, ' ', u.lastname) AS createby,
        c.categoryname,
        s.statusstate,
        d.departmentname,
        sla.prioritylevel,
        p.comment
      FROM Problem p
      JOIN Users u ON p.createby = u.usersid
      JOIN Category c ON p.categoryid = c.categoryid
      JOIN Status s ON p.statusid = s.statusid
      JOIN Department d ON p.departmentid = d.departmentid
      JOIN ServiceLevelAgreement sla ON p.priorityid = sla.priorityid
      WHERE p.createby = $1
      ORDER BY p.problemid DESC
      LIMIT 3;
    ` , [req.session.user.usersid]);
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getMyHistory = async (req, res) =>  {
  try {
    const result = await pool.query(`
      SELECT 
        p.problemid,
        p.title,
        p.description,
        p.description,
        p.createat,
        p.location,
        CONCAT (u.firstname, ' ', u.lastname) AS createby,
        c.categoryname,
        s.statusstate,
        d.departmentname,
        sla.prioritylevel,
        p.comment
      FROM Problem p
      JOIN Users u ON p.createby = u.usersid
      JOIN Category c ON p.categoryid = c.categoryid
      JOIN Status s ON p.statusid = s.statusid
      JOIN Department d ON p.departmentid = d.departmentid
      JOIN ServiceLevelAgreement sla ON p.priorityid = sla.priorityid
      WHERE p.createby = $1
      ORDER BY p.problemid DESC
    ` , [req.session.user.usersid]);
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getMyWorkAssignment = async (req, res) =>  {
  try {
      const result = await pool.query(`
      select 
		p.problemid,
        p.createat,
        p.title,
        c.categoryname,
        CONCAT (u2.firstname, ' ', u2.lastname) AS createby,
        p.description,
        d.departmentname,
        s.statusstate,
        sla.prioritylevel,
        p.location,
        wk.assignat,
        sla.resolvetime,
        wk.finishat
      from problem p
      JOIN department d on p.departmentid = d.departmentid
      join status s on p.statusid = s.statusid
      join workassignment wk on p.problemid = wk.problemid
      join category c on p.categoryid = c.categoryid
      join servicelevelagreement sla on p.priorityid = sla.priorityid
      join users u on u.usersid = wk.usersid
	    join users u2 on p.createby = u2.usersid
     
      WHERE wk.usersid = $1 AND s.statusid != 5
      ORDER BY p.problemid DESC;
      ;`, [req.session.user.usersid]);
      res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getMyWorkHistory = async (req, res) =>  {
  try {
      const result = await pool.query(`
      select 
		p.problemid,
        p.createat,
        p.title,
        c.categoryname,
        CONCAT (u2.firstname, ' ', u2.lastname) AS createby,
        p.description,
        d.departmentname,
        s.statusstate,
        sla.prioritylevel,
        p.location,
        wk.assignat,
        sla.resolvetime,
        wk.finishat
      from problem p
      JOIN department d on p.departmentid = d.departmentid
      join status s on p.statusid = s.statusid
      join workassignment wk on p.problemid = wk.problemid
      join category c on p.categoryid = c.categoryid
      join servicelevelagreement sla on p.priorityid = sla.priorityid
      join users u on u.usersid = wk.usersid
	    join users u2 on p.createby = u2.usersid
     
      WHERE wk.usersid = $1
      ORDER BY p.problemid DESC;
      ;`, [req.session.user.usersid]);
      res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const addProblem = async (req, res) => {

  const { title, description, categoryid, statusid, departmentid, priorityid, location, comment } = req.body;
  const createby = req.session.user.usersid; // ดึงจาก session
  const createat = new Date();// เวลาปัจจุบัน
  try {
    await pool.query(
    `INSERT INTO Problem
    (title, description, createby, categoryid, createat, statusid, departmentid, priorityid, location, comment)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [title, description, createby, categoryid, createat, statusid, departmentid, priorityid, location, comment]
  );

    res.json({ success: true });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  } 

};

export const checkSession = (req, res) => {
  if (req.session && req.session.user) {
      return res.json({ loggedIn: true, user: req.session.user });
  }
    res.json({ loggedIn: false });
}

export const getCategory = async (req, res) => {
   try {
    const result = await pool.query("SELECT categoryid, categoryname FROM category");
      console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
      console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
};

export const getDepartment = async (req, res) => {
  try {
    const result = await pool.query("SELECT departmentid, departmentname FROM department");
      console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
      console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
};

export const getPriority = async (req, res) => {
  try {
      const result = await pool.query("SELECT priorityid, prioritylevel FROM servicelevelagreement");
        console.log(result.rows);
      res.json(result.rows);
    } catch (err) {
        console.error(err);
      res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
};