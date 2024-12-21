const exp = require("express");
const db = require("../../config/database");
const router = exp.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  var requestBody = req.body.requestData;
  db.getConnection((err, conn) => {
    if (err) {
      console.log("login db connection error", err);
      return res.status(503).send({
        message: "Error occured while connecting to the database",
        status: false,
      });
    } else {
      let email = requestBody.email;
      let password = requestBody.password;
      let loginQuery = `SELECT userid, orgid, email from logininfo WHERE email='${email}' AND password='${password}' AND isactive='1'`;
      conn.query(loginQuery, async (error, loginResult) => {
        if (error) {
          return res
            .status(500)
            .send({ message: error.sqlMessage, status: false });
        } else {
          if (loginResult.length == 0) {
            return res.send({
              message: "Invalid Credentials",
              status: false,
              statusCode: 409,
            });
          } else {
            return res.send({
              message: "Login Successful",
              status: true,
              responseObject: loginResult,
              statusCode: 200,
            });
          }
        }
      });
    }
  });
});

module.exports = router;
