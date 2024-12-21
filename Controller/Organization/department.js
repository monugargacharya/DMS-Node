const exp = require("express");
const db = require("../../config/database");
const router = exp.Router();

router.post("/create", async (req, res) => {
  var requestBody = req.body.requestData;
  db.getConnection((err, conn) => {
    if (err) {
      console.log("create department db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let deptName = requestBody.deptName;
      let orgId = requestBody.orgId;
      let sql = `INSERT INTO departments SET deptname='${deptName}', orgid='${orgId}'`;
      conn.query(sql, async (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          return res.json({
            status: true,
            message: "Department created successfully",
            statusCode: 200,
          });
        }
      });
      conn.release();
    }
  });
});

router.post("/update", async (req, res) => {
  var requestBody = req.body.requestData;
  db.getConnection((err, conn) => {
    if (err) {
      console.log("update department db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let deptName = requestBody.deptName;
      let departmentId = requestBody.departmentId;
      let sql = `UPDATE departments SET deptname='${deptName}' where departmentid='${departmentId}'`;
      conn.query(sql, async (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          return res.json({
            status: true,
            message: "Department name updated successfully",
            statusCode: 200,
          });
        }
      });
      conn.release();
    }
  });
});

router.post("/list", async (req, res) => {
  var requestBody = req.body.requestData;
  db.getConnection((err, conn) => {
    if (err) {
      console.log("list department db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let orgId = requestBody.orgId;
      let sql = `Select departmentid, orgid, deptname from departments where orgid='${orgId}'`;
      conn.query(sql, async (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          if (result.length == 0) {
            return res.json({
              status: false,
              message: "No departments found",
              statusCode: 409,
            });
          } else {
            return res.json({
              status: true,
              message: "Departments fetched successfully",
              responseObject: result,
              statusCode: 200,
            });
          }
        }
      });
      conn.release();
    }
  });
});

router.post("/delete", async (req, res) => {
  var requestBody = req.body.requestData;
  db.getConnection((err, conn) => {
    if (err) {
      console.log("delete department db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let departmentId = requestBody.departmentId;
      let sql = `DELETE FROM departments where departmentid='${departmentId}'`;
      conn.query(sql, async (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          if (result.affectedRows == 0) {
            return res.json({
              status: false,
              message: "Department not found",
              statusCode: 409,
            });
          } else {
            return res.json({
              status: true,
              message: "Department deleted successfully",
              statusCode: 200,
            });
          }
        }
      });
      conn.release();
    }
  });
});

module.exports = router;
