const exp = require("express");
const db = require("../../config/database");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const users = exp.Router();




module.exports = users