const express = require("express")
const router  = express.Router()
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const bcrypt  = require("bcrypt")
require("dotenv").config()


//const secret  = "secret-thing"
const secret  = process.env.JWT_SECRET

router.post ('/register', async (req, res) => {
    //res.sendFile('/index.html', {root: __dirname});

    try {
        let a  = {
            name: req.body.name, 
            email: req.body.email, 
            password: bcrypt.hashSync(req.body.password, 8)
        }

        let b= {
            name: req.body.name, 
            email: req.body.email, 
            password: bcrypt.hashSync(req.body.password, 8), 
            isAdmin: req.body.isAdmin
        }


        let aUser = new Users (req.body.isAdmin? b : a)
        await aUser.save();
        res.send("user saved")
    }

    catch (err) {
        //console.log (err.errors.password)
        res.send('something went wrong!')
    }

})


router.post ('/login', (req, res) => {
    //res.sendFile('/index.html', {root: __dirname});

    async function checkUser() {
        let user = await Users.findOne({
            email: req.body.email
        });

        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            
            const expiresIn = "2h"
            const accessToken = jwt.sign ({sub: user.id }, secret, {expiresIn})

            return res.send({
                success: true,
                accessToken: accessToken  
            })
        }
        res.send("invalid credentials!")
    }
    checkUser();

})


router.get ('/me', async (req, res) => {
    //res.sendFile('/index.html', {root: __dirname});

    try {
        let token = req.headers["authorization"];
        token = token.replace("Bearer", "").trim();
        let payload = jwt.verify(token, secret);
        const userID = payload.sub; 
        let user  = await Users.findById(userID)
        res.send(user)
    }

    catch (err) {
        res.send("you're not authorized to access this end point")
    }
    

})


module.exports = router