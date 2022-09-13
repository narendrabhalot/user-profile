const mongoose= require('mongoose')
const userModel = require('../model/usermodel')
const jwt = require('jsonwebtoken')



////************    USER REGISTRATION   ********** *//


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};


function isValid(value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true
}


const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId); // returns a boolean
  };
  


const isValidEmail = function (email) {
    const check =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return check.test(email);
};



const userCreate = async function (req, res) {
    try {

        let data = req.body

        let { firstName, lastName, email, password } = data

        if (!isValidRequestBody(data)) {
            res.status(400).send({ status: "please fill option" })
        }

        if (!isValid(firstName)) {
            res
                .status(400)
                .send({ status: false, message: "FirstName is mandatory" });
            return;
        }

        if (!isValid(lastName)) {
            res
                .status(400)
                .send({ status: false, message: "LastName is mandatory" });
            return;
        }

        if (!isValid(email)) {
            res
                .status(400)
                .send({ status: false, message: "email is mandatory" });
            return;
        }

        if (!isValid(password)) {
            res
                .status(400)
                .send({ status: false, message: "Password is mandatory" });
            return;
        }

        if (!isValidEmail(email)) {
            res.status(400).send({ status: false, message: "Email is invalid" });
            return;
        }
        // check email is unique or not
        const isExistEmail = await userModel.findOne({ email: email });
        if (isExistEmail) {
            res
                .status(400)
                .send({ status: false, message: "This Email is alredy exist" });
            return;
        }

        if (!(password.length > 8 && password.length < 15)) {
            res
                .status(400)
                .send({ status: false, message: "password length between 8-15" });
            return;
        }



        const creatData = await userModel.create(data)
        res.status(201).send({
            status: true,
            data: creatData,
            message: "registration successfil"
        })
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }



}


const userLogIn = async function (req, res) {

    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "email is required" })
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, msg: "please enter a valid email" })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }

        const checkedUser = await userModel.findOne({ email: email, password: password });
        if (!checkedUser) {
            return res.status(401).send({ status: false, msg: "email or password is not correct" });
        }

        else {
            const token = jwt.sign({ userId: checkedUser._id.toString() }, "narendra123", { expiresIn: '1d' });
            res.header('x-auth-key', token)
            return res.status(201).send({ status: true, Token: token });
        }

    }
    catch (error) { res.status(500).send({ msg: error.message }) }
};



const userList = async function (req, res) {
    try {
        const alluser = await userModel.find()

        if (alluser.length == 0) {
            res.send(404).send({ status: false, message: "no any user exist" })
        }

        res.status(200).send({ status: true, data: alluser })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}



const userUpdate = async function (req, res) {
    try {
        let userId = req.params.userId
        let user = await userModel.findById(userId)


        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "invalid userId" })
        }
        if (!user) {
            return res.status(404).send({ status: "false", msg: "No such user exists " })
        };

        let body = req.body

        let emailAlreadyExist = await userModel.findOne({ email: body.email })
        if (emailAlreadyExist) {
            return res.status(400).send({ status: false, message: 'email is already exist' })
        }
        let result = await userModel.findOneAndUpdate({ _id: user._id }, body, { new: true })
        res.status(200).send({ data: result })


    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ msg: "error", error: err.message })
    }
}




const deleteuser = async function (req, res) {

    try {
        let userId = req.params.userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "invalid userId" })
        }
        let checkuser = await userModel.findById(userId)
       

        if (!checkuser) {
            return res.status(404).send({ status: false, msg: "No user found this userId" })

        }

        await userModel.remove({ _id: userId })
        return res.status(200).send({ status: true, message: "user deleted successfully" })
    }

    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}











module.exports.userCreate = userCreate
module.exports.userLogIn = userLogIn;
module.exports.userList = userList;
module.exports.userUpdate = userUpdate
module.exports.deleteuser = deleteuser














