const exp = require("express");
const db = require("../../config/database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const router = exp.Router();

router.post("/create", async (req, res) => {
  var requestBody = req.body.requestData;
  db.getConnection((err, conn) => {
    if (err) {
      console.log("create user db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let password = Math.random().toString(36).slice(-14);
      let orgId = requestBody.orgId;
      let userName = requestBody.userName;
      let email = requestBody.email;
      let phone = requestBody.phone;
      let roleId = requestBody.roleId;
      let departmentId = requestBody.departmentId;
      let doerCheck = requestBody.doerCheck;
      let reviewerCheck = requestBody.reviewerCheck;
      let approverCheck = requestBody.approverCheck;
      let issuerCheck = requestBody.issuerCheck;
      let userQuery = `INSERT into users SET orgid='${orgId}', name='${userName}', email='${email}', 
                    phone='${phone}', roleid='${roleId}', departmentid='${departmentId}', isactive='1'`;
      conn.query(userQuery, async (error, userResult) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          let permissionQuery = `INSERT into permissions SET userid='${userResult.insertId}', doer_check='${doerCheck}',
                              reviewer_check='${reviewerCheck}', approver_check='${approverCheck}', issuer_check='${issuerCheck}'`;
          conn.query(permissionQuery, async (error1, permissionResult) => {
            if (error1) {
              return res
                .status(500)
                .send({ message: error1.sqlMessage, status: false });
            } else {
              let loginInfoQuery = `INSERT into logininfo SET id='${uuidv4()}', orgid='${orgId}', userid='${
                userResult.insertId
              }', email='${email}', password='${password}', isactive='1'`;
              conn.query(loginInfoQuery, async (error2, loginInfoResult) => {
                if (error2) {
                  return res
                    .status(500)
                    .send({ message: error2.sqlMessage, status: false });
                } else {
                  return res.send({
                    message: "User Created Successfully",
                    status: true,
                    responseObject: {
                      userId: email,
                      password: password,
                    },
                    statusCode: 200,
                  });
                }
              });
            }
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
      console.log("update user db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let userId = requestBody.userId;
      let userName = requestBody.userName;
      let email = requestBody.email;
      let phone = requestBody.phone;
      let roleId = requestBody.roleId;
      let departmentId = requestBody.departmentId;
      let isActive = requestBody.isActive;
      let doerCheck = requestBody.doerCheck;
      let reviewerCheck = requestBody.reviewerCheck;
      let approverCheck = requestBody.approverCheck;
      let issuerCheck = requestBody.issuerCheck;
      let userQuery = `UPDATE users SET name='${userName}', email='${email}', 
                      phone='${phone}', roleid='${roleId}', departmentid='${departmentId}', isactive='${isActive}' where userid='${userId}'`;
      conn.query(userQuery, async (error, userResult) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          let permissionQuery = `UPDATE permissions SET doer_check='${doerCheck}',
                                reviewer_check='${reviewerCheck}', approver_check='${approverCheck}', issuer_check='${issuerCheck}' where userid='${userId}'`;
          conn.query(permissionQuery, async (error1, permissionResult) => {
            if (error1) {
              return res
                .status(500)
                .send({ message: error1.sqlMessage, status: false });
            } else {
              let loginInfoQuery = `UPDATE logininfo SET email='${email}', isactive='${isActive}' where userid='${userId}'`;
              conn.query(loginInfoQuery, async (error2, loginInfoResult) => {
                if (error2) {
                  return res
                    .status(500)
                    .send({ message: error2.sqlMessage, status: false });
                } else {
                  return res.send({
                    message: "User information updated successfully",
                    status: true,
                    statusCode: 200,
                  });
                }
              });
            }
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
      console.log("list user db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let orgId = requestBody.orgId;
      let isActive = requestBody.isActive;
      let userQuery = `SELECT us.userid, us.name, us.email, us.phone, us.departmentid, us.roleid, pm.doer_check, pm.reviewer_check,
                        pm.approver_check, pm.issuer_check, us.isactive FROM users us INNER JOIN permissions pm ON 
                        us.userid = pm.userid WHERE us.orgid='${orgId}' and us.isactive='${isActive}'`;
      conn.query(userQuery, async (error, userResult) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          if (userResult.length == 0) {
            return res.send({
              message: "No user found",
              status: false,
              statusCode: 409,
            });
          } else {
            return res.send({
              message: "Data fetched successfully",
              status: true,
              responseObject: userResult,
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
      console.log("delete user db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let userId = requestBody.userId;
      let userQuery = `UPDATE users SET isactive='0' where userid='${userId}'`;
      conn.query(userQuery, async (error, userResult) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          let loginInfoQuery = `UPDATE logininfo SET isactive='0' where userid='${userId}'`;
          conn.query(loginInfoQuery, async (error2, loginInfoResult) => {
            if (error2) {
              return res
                .status(500)
                .send({ message: error2.sqlMessage, status: false });
            } else {
              return res.send({
                message: "User deleted successfully",
                status: true,
                statusCode: 200,
              });
            }
          });
        }
      });
      conn.release();
    }
  });
});

router.post("/profile", async (req, res) => {
  var requestBody = req.body.requestData;
  db.getConnection((err, conn) => {
    if (err) {
      console.log("get user profile db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let userId = requestBody.userId;
      let userQuery = `SELECT us.userid, us.name, us.email, us.phone, us.departmentid, us.roleid, pm.doer_check, pm.reviewer_check,
                          pm.approver_check, pm.issuer_check FROM users us INNER JOIN permissions pm ON 
                          us.userid = pm.userid WHERE us.userid='${userId}'`;
      conn.query(userQuery, async (error, userResult) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          if (userResult.length == 0) {
            return res.send({
              message: "No information found",
              status: false,
              statusCode: 409,
            });
          } else {
            return res.send({
              message: "Information fetched successfully",
              status: true,
              responseObject: userResult,
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
