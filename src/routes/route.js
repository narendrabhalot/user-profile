
const express = require("express");
const router = express.Router();
const userCreate= require('../controller/usercontroller') 
const authentication = require('../middlewere/auth')



router.post('/register', userCreate.userCreate)
router.post('/userlogin', userCreate.userLogIn)
router.get('/userlisting', userCreate.userList)
router.put('/useredit/:userId',authentication, userCreate.userUpdate)
router.delete('/userdelete/:userId',authentication, userCreate.deleteuser)


module.exports = router
