const { Router } = require('express');
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/userSchema');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
router.get('/', (req,res) => {
    res.send("home router.js")
});

//////////////With Promises///////////////////

// router.post('/register', (req,res) => {
//     const {name, email, password , cpassword, work, phone} = req.body;
//     if(!name || !email || !password || !cpassword || !work || !phone){
//         return res.status(422).json({error : "Please fill the field properly"});
//     }
//     User.findOne({email: email})
//     .then((userExist) => {
//         if(userExist) {
//             return res.status(422).json({error: "Email already Exist"});
//         }
//         const user = new User({name, email, password, cpassword, work, phone});

//         user.save().then(() => {
//             res.status(422).json({message : "User registered Successfully !"});
//         }).catch((err) => {
//             res.status(500).json({error:"Failed to register"});
//         })
//     }).catch((err) =>{
//         console.log(err);
//     })
// });


//////////////With Async & Await//////////////////////

router.post('/register', async (req,res) => {
        const {name, email, password , cpassword, work, phone} = req.body;
        if(!name || !email || !password || !cpassword || !work || !phone){
            return res.status(422).json({error : "Please fill the field properly"});
        }
        try{
            const userExist = await User.findOne({ email : email});
            if(userExist){
                return res.status(422).json({error: "Email already exist"});
            }else if(password != cpassword){
                return res.status(422).json({error: "password not samet"});
            }
            const user = new User({name , email, phone, work, password, cpassword});
            await user.save();
            res.status(201).json({message: "user registered successfully !"});

        } catch(err){
            console.log(err);
        }
});
  
router.post('/signin', async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({error:"Please fill the details properly"});
        }
        const userLogin = await User.findOne({email: email});
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password)
            const token = await userLogin.generateAuthToken();
            console.log(token);
            if(!isMatch){
                res.status(400).json({error: "Invalid Credentials!"});
            }else{
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 2589000000),
                    httpOnly: true
                });
                res.json({message: "User SignIn Successfully!"});
            }
        }else{
            res.status(400).json({error: "Invalid Credentials!"});
        }
    }catch(err){
        console.log(err)
    }

})
router.get('/about',authenticate,(req,res) => {
     res.send(req.rootUser);
});
module.exports =  router;