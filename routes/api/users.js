const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const passport = require('passport');
const JWT = require("jsonwebtoken");
const stripeApi = require('stripe')(process.env.STRIPESECRETKEY);
//load User model
const {UserModel} = require('../../models');
const keys = require('../../config/keys');


// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");


const JWT_SECRET = keys.secretOrKey;

signToken = (user,payload) => {
  return JWT.sign(
      {
        iss: "NGI GPS backend server",
        sub: user.id ,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getMonth() + 1),
        //additional: payload,
       user:user,
       
      },
      
      JWT_SECRET
  );
};


router.get('/current' , passport.authenticate('jwt',{session:false}),
(req,res)=> {

res.json({

  id:req.user.id,
  username:req.user.username,
  email:req.user.email,
  fullname:req.user.fullname,
});
}

);



// @route    GET api/users/test
// @desc     Tests user route 
// @access   Public 
router.get('/test', (req,res) =>res.json({msg : 'Users works'}));


// get all users
router.get('/', passport.authenticate('jwt', { session: false }),(req, res) => {
  UserModel.find((err, users) => {
    if (err) console.log(err);
    return res.json(users);
  }); 
});



/*GET All Role Users . 
/Route : users/users
*/
router.get('/users', (req, res) => {
  UserModel.find()
      .where({role:"user"})
      .then((data) => {
          res.json(data);
      })
      .catch((err) => res.send(err));
});


// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  UserModel.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new UserModel({
      
            username:req.body.username,
            email:req.body.email,
            number:req.body.number,
            fullname:req.body.fullname,
            //avatar:avatar,
            password:req.body.password,
            isActive:false,
            role:"admin"}
    );

    
// Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});


// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  let { email, password } = req.body;
  // Find user by username
  UserModel.findOne({ "email" :email }).then(user => {
    // Check for user
    if (!user) {
      return res.status(400).json('user not found');
    }
    // Check Password
    if (user.role==="admin"){
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const id = user;
          const {  username, email, avatar } = user;
          const payload = { id, username, email, avatar };
          // Sign Token
          jwt.sign(payload, keys.secretOrKey, { expiresIn: "20 days" }, (err, token) => {
            return res.json({
              success: true,
              token,
            });
          });
        } else {
          return res.status(401).json('Password incorrect');
        }
      });
    }
  });
});











router.post('/mobile/signin', (req, res,done) => {
  let { email, password  } = req.body;
  passport.authenticate("jwt", { session: false }, function(err, user, info)
  {
  
    UserModel.findOne({ "email" :email }).then(user => {
      // Check for user
      if (!user) {
        return res.status(400);
      }
      // Check Password
      if (user.role==="admin"){
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            const payload ={id:user.id, username:user.username,number:user.number, fullname:user.fullname, avatar:user.avatar}   
            // Sign Token
         jwt.sign(payload, keys.secretOrKey, { expiresIn: "20 days" }, (err, token) => {
            return res.json({
              success: true,
              token :"Bearer " + token,
          
            });
          });
             
           }
        });
      }
    });
  })(req, res, done);
  
  
});
router.post('/mobile/oauth/google', (req, res,done) => {
  passport.authenticate("google-id-token", { session: false }, function(err, user, info)
  {
    if (err) res.send(err);
    else if (user == false)
      res.status(401).send(info);
    else {
      req.body = user;
      const token = sign(new UserModel(req.body));
      res.status(200).json({ token });
      done();
    }
  })(req, res, done);

  console.log(req.body);


});
router.post('/mobile/oauth/facebook', (req, res,done) => {
  passport.authenticate("facebookToken", { session: false }, function(err, user, info)
  {
    if (err) res.send(err);
    else if (user == false)
      res.status(401).send(info);
    else {
      req.body = user;
      const token = signToken(new UserModel(req.body));
      res.status(200).send({ token });
      done();
    }
  })(req, res, done);



});

// update user
router.post('/update/:id', (req, res) => {
  var { email, password } = req.body;
  UserModel.findById(req.params.id, function(err, doc) {
    if (err)
      console.log(err);
    doc.email = email;
    doc.avatar = gravatar.url(email, {s: '100', r: 'x', d: 'retro'}, false);
    doc.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    doc.save((err, doc) => {
      if (err) res.send(err);
      else {
        const {id, username , email, avatar, createdAt } = doc;
        res.send({id, username , email, avatar, createdAt});}
    });
  });
});

// get user by id
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  UserModel.findById(req.params.id, (err, user) => {
    if (err) console.log(err);
    return res.json(user);
  });
});

router.post('/mobile/signup/local', (req, res,done) => {
  const { fullname, email, password, number, username } = req.body;

  const newUser = new UserModel({
    method: 'local',
    local: {
      fullname: fullname,
      email: email,
      password: password,
      number: number,
      username:username
    }
  });
  try {
    newUser.save();
    // generate a JWT token
    const token = signToken(newUser);

 

    // respond with token
    res.status(200).send({ token });
  } catch (err) {
    throw (err);
  }


});

//Active users finder API
router.get("/users/active", (req, res) => {
  const users = UserModel.find({ isActive: true });
  users.exec().then(data => {
    res.json(data);
  });
});

//Inactive users finder API
router.get("/users/inactive", (req, res) => {
  const users = UserModel.find({ isActive: false });
  users.exec().then(data => {
    res.json(data);
  });
});

router.get("/find/:id", (req, res) => {
  const user = UserModel.find({ id: req.params.id });
  user.exec().then(data => {
    res.json(data[0]);
  });
});



module.exports = router ; 