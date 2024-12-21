const exp = require("express");
const db = require("../../config/database");
const { v4: uuidv4 } = require("uuid");
const router = exp.Router();

router.post("/create", async (req, res) => {
  var requestBody = req.body.requestData;
  db.getConnection((err, conn) => {
    if (err) {
      console.log("create organization db connection error", err);
      return res
        .status(503)
        .send({
          message: "Error occured while connecting to the database",
          status: false,
        });
    } else {
      let password = Math.random().toString(36).slice(-14);
      let orgName = requestBody.orgName;
      let email = requestBody.email;
      let phone = requestBody.phone;
      let address = requestBody.address;

      // organization creation
      let orgQuery = `INSERT INTO organization SET orgname='${orgName}', email='${email}', phone='${phone}',
                        address='${address}',isactive='1'`;
      conn.query(orgQuery, async (error, orgResult) => {
        if (error) {
          return res.status(500).send({
            message: error.sqlMessage,
            status: false,
          });
        } else {
          // department creation
          let deptQuery = `INSERT INTO departments SET deptname='ADMIN', orgid='${orgResult.insertId}'`;
          conn.query(deptQuery, async (error1, deptResult) => {
            if (error1) {
              return res.status(500).send({
                message: error1.sqlMessage,
                status: false,
              });
            } else {
              // role creation
              let roleQuery = `INSERT INTO roles SET rolename='ADMIN', orgid='${orgResult.insertId}'`;
              conn.query(roleQuery, async (error2, roleResult) => {
                if (error1) {
                  return res.status(500).send({
                    message: error2.sqlMessage,
                    status: false,
                  });
                } else {
                  // user creation
                  let userQuery = `INSERT INTO users SET orgid='${orgResult.insertId}', name='${orgName}', email='${email}', phone='${phone}',
                                                departmentid='${deptResult.insertId}', roleid='${roleResult.insertId}', isactive='1'`;
                  conn.query(userQuery, async (error3, userResult) => {
                    if (error3) {
                      return res.status(500).send({
                        message: error3.sqlMessage,
                        status: false,
                      });
                    } else {
                      // permission creation
                      let permissionQuery = `INSERT INTO permissions SET userid='${userResult.insertId}', 
                      doer_check='1', reviewer_check='1', approver_check='1', issuer_check='1'`;
                      conn.query(
                        permissionQuery,
                        async (error4, permissionResult) => {
                          if (error4) {
                            return res.status(500).send({
                              message: error4.sqlMessage,
                              status: false,
                            });
                          } else {
                            // logininfo creation
                            let loginInfoQuery = `INSERT INTO logininfo SET id='${uuidv4()}', orgid='${
                              orgResult.insertId
                            }', userid='${
                              userResult.insertId
                            }', email='${email}', password='${password}', isactive='1'`;
                            conn.query(
                              loginInfoQuery,
                              async (error5, loginInfoResult) => {
                                if (error5) {
                                  return res.status(500).send({
                                    message: error5.sqlMessage,
                                    status: false,
                                  });
                                } else {
                                  return res.json({
                                    status: true,
                                    message:
                                      "Organization registered successfully, please find below your login credentials",
                                    responseObject: {
                                      email: email,
                                      password: password,
                                    },
                                    statusCode: 200,
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    }
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

router.post("/delete", async (req, res) => {
  var requestBody = req.body.requestData;
  db.getConnection((err, conn) => {
    if (err) {
      console.log("delete organization db connection error", err);
      return res
        .status(503)
        .send({
          message: "Error occured while connecting to the database",
          status: false,
        });
    } else {
      let orgId = requestBody.orgId;
      let orgQuery = `UPDATE organization SET isactive='0' where orgid='${orgId}'`;
      conn.query(orgQuery, async (error, orgRes) => {
        if (error) {
          return res.status(500).send({
            message: error.sqlMessage,
            status: false,
          });
        } else {
          let userQuery = `UPDATE users SET isactive='0' where orgid='${orgId}'`;
          conn.query(userQuery, async (error1, userRes) => {
            if (error1) {
              return res
                .status(500)
                .send({ message: error.sqlMessage, status: false });
            } else {
              let loginInfoQuery = `UPDATE logininfo SET isactive='0' where orgid='${orgId}'`;
              conn.query(loginInfoQuery, async (error2, loginInfoRes) => {
                if (error2) {
                  return res.status(500).send({
                    message: error.sqlMessage,
                    status: false,
                  });
                } else {
                  return res.json({
                    status: true,
                    message: "Organization deleted successfully",
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

router.post("/activate", async (req, res) => {
  var requestBody = req.body.requestData;
  db.getConnection((err, conn) => {
    if (err) {
      console.log("activate organization db connection error", err);
      return res
        .status(503)
        .send({
          message: "Error occured while connecting to the database",
          status: false,
        });
    } else {
      let orgId = requestBody.orgId;
      let orgQuery = `UPDATE organization SET isactive='1' where orgid='${orgId}'`;
      conn.query(orgQuery, async (error, orgRes) => {
        if (error) {
          return res.status(500).send({
            message: error.sqlMessage,
            status: false,
          });
        } else {
          let userQuery = `UPDATE users SET isactive='1' where orgid='${orgId}'`;
          conn.query(userQuery, async (error1, userRes) => {
            if (error1) {
              return res
                .status(500)
                .send({ message: error.sqlMessage, status: false });
            } else {
              let loginInfoQuery = `UPDATE logininfo SET isactive='1' where orgid='${orgId}'`;
              conn.query(loginInfoQuery, async (error2, loginInfoRes) => {
                if (error2) {
                  return res.status(500).send({
                    message: error.sqlMessage,
                    status: false,
                  });
                } else {
                  return res.json({
                    status: true,
                    message: "Organization activated successfully",
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

router.get("/list", async (req, res) => {
  db.getConnection((err, conn) => {
    if (err) {
      console.log("list organization db connection error", err);
      return res
        .status(503)
        .send({
          message: "Error occured while connecting to the database",
          status: false,
        });
    } else {
      let orgQuery = `SELECT orgid, orgname, email, phone, address, isactive from organization`;
      conn.query(orgQuery, async (error, orgRes) => {
        if (error) {
          return res.status(500).send({
            message: error.sqlMessage,
            status: false,
          });
        } else {
          if (orgRes.length == 0) {
            return res.json({
              status: false,
              message: "No organizations found",
              statusCode: 409,
            });
          } else {
            return res.json({
              status: true,
              message: "Organizations fetched successfully",
              responseObject: orgRes,
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
