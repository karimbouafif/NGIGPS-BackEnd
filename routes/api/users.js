const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt   = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load Input Validation 
const validateRegisterInput =require('../../validation/register');
const validateLoginInput  = require('../../validation/login');

//load User model
const User =require('../../models/model.user');



signToken = user => {
    return JWT.sign(
        {
          iss: "ngigps backend server",
          sub: user.id,
          iat: new Date().getTime(),
          exp: new Date().setDate(new Date().getMonth() + 1),
          user: user
        },
       keys.secretOrKey
    );
  };







// @route    GET api/users/test
// @desc     Tests user route 
// @access   Public 
router.get('/test', (req,res) =>res.json({msg : 'Users works'}));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { username, password, email} = req.body;
  User.findOne({ "local.email" :email }).then(user => {
    if (user) {
      return res.status(400).json('Email already exists !');
    }
    const avatar = gravatar.url(email, {s: '100', r: 'x', d: 'retro'}, false);
    const newUser = new User({
      method: 'local',
      local:
          {
            username:username,
            email:email,
            avatar:avatar,
            password:password,
            role:"admin"}
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.local.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.local.password = hash;
        newUser
            .save((err) => {
              if (err)  {
                console.log(err.toString());
                res.status(400).json('Register has failed')
              }
              else
                return res.status(200).json('User is succsessfully added');
            })

      });
    });
  });
});


// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  let { username, password } = req.body;
  // Find user by username
  User.findOne({ "local.username" :username }).then(user => {
    // Check for user
    if (!user) {
      return res.status(400).json('user not found');
    }
    // Check Password
    if (user.local.role==="admin"){
      bcrypt.compare(password, user.local.password).then(isMatch => {
        if (isMatch) {
          const id = user;
          const {  username, email, avatar } = user.local;
          const payload = { id, username, email, avatar };
          // Sign Token
          jwt.sign(payload, keys.secretOrKey, { expiresIn: "20 days" }, (err, token) => {
            return res.json({
              success: true,
              token,
            });
          });
        } else {
          return res.status(400).json('Password incorrect');
        }
      });
    }
  });
});
// @route    GET api/users/current  
// @desc     return current user
// @access    Private 
router.get('/current',passport.authenticate('jwt',{ session: false }), 
(req,res)=> {

res.json({

id: req.user.id,
username:req.user.username,
email:req.user.email

})
});




module.exports = router ; 