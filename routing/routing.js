const exp = require("express");
const router = exp();

const userControl = require("../Controller/User/user");
const organizationControl = require("../Controller/Organization/organization");
const departmentControl = require("../Controller/Organization/department");
const rolesControl = require("../Controller/Organization/roles");
const loginControl = require("../Controller/login/login");

router.get("/api", (req, res) => {
  res.send("Server is running");
});

router.use(exp.static("./public"));
router.use("/dms/user", userControl);
router.use("/dms/organization", organizationControl);
router.use("/dms/department", departmentControl);
router.use("/dms/role", rolesControl);
router.use("/dms/login", loginControl);

module.exports = router;
