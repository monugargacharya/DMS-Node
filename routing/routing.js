const exp = require('express')
const rout = exp();

const userController = require('../Controller/User/userController');

rout.get('/api', (req, res)=>{
   res.send('APi is working');
});

rout.use(exp.static("./public"));
rout.use('/api', userController);

module.exports = rout;