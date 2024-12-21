const exp = require("express");
const db = require("../../config/database");
const router = exp.Router();

router.post("/create", async (req, res) => {
  var requestBody = req.body.requestData;
  db.getConnection((err, conn) => {
    if (err) {
      console.log("create role db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let roleName = requestBody.roleName;
      let orgId = requestBody.orgId;
      let sql = `INSERT INTO roles SET rolename='${roleName}', orgid='${orgId}'`;
      conn.query(sql, async (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          return res.json({
            status: true,
            message: "Role created successfully",
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
      console.log("update role db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let roleName = requestBody.roleName;
      let roleId = requestBody.roleId;
      let sql = `UPDATE roles SET rolename='${roleName}' where roleid='${roleId}'`;
      conn.query(sql, async (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          return res.json({
            status: true,
            message: "Role name updated successfully",
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
      console.log("list role db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let orgId = requestBody.orgId;
      let sql = `Select roleid, orgid, rolename from roles where orgid='${orgId}'`;
      conn.query(sql, async (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          if (result.length == 0) {
            return res.json({
              status: false,
              message: "No roles found",
              statusCode: 409,
            });
          } else {
            return res.json({
              status: true,
              message: "Roles fetched successfully",
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
      console.log("delete role db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let roleId = requestBody.roleId;
      let sql = `DELETE FROM roles where roleid='${roleId}'`;
      conn.query(sql, async (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          if (result.affectedRows == 0) {
            return res.json({
              status: false,
              message: "Role not found",
              statusCode: 409,
            });
          } else {
            return res.json({
              status: true,
              message: "Role deleted successfully",
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
