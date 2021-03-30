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


const JWT_SECRET = process.env.TOKEN_KEY;

signToken = (user,payload) => {
  return JWT.sign(
      {
        iss: "NGI GPS backend server",
        sub: user.id ,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getMonth() + 1),
        additional: payload,
        user: user
      },
      JWT_SECRET
  );
};


/*
// get  user
router.get('/current', passport.authenticate('jwt', { session: false }),(req, res) => {
  UserModel.find((err, user) => {
    if (err) console.log(err);
    return res.json(user);
  });
});
*/



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



// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { username, password, email,fullname} = req.body;
  UserModel.findOne({ "local.email" :email }).then(user => {
    if (user) {
      return res.status(400).json('Email already exists !');
    }
    const avatar = gravatar.url(email, {s: '100', r: 'x', d: 'retro'}, false);
    const newUser = new UserModel({
      method: 'local',
      local:
          {
            username:username,
            fullname:fullname,
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
router.post('/login', (req, res,done) => {
  let { number, password  } = req.body;
  // Find user by username
  UserModel.findOne({ "local.number" :number }).then(user => {
    // Check for user
    if (!user) {
      return res.status(400);
    }
    // Check Password
    if (user.local.role==="admin"){
      bcrypt.compare(password, user.local.password).then(isMatch => {
        if (isMatch) {
          const id = user;
          const {  username, email, avatar, } = user.local;
          const payload = { id, username, email, avatar };
          // Sign Token
          jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: "20 days" }, (err, token) => {
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
  let { number, password  } = req.body;
  passport.authenticate("local", { session: false }, function(err, user, info)
  {
  
    UserModel.findOne({ "local.number" :number }).then(user => {
      // Check for user
      if (!user) {
        return res.status(400);
      }
      // Check Password
      if (user.local.role==="admin"){
        bcrypt.compare(password, user.local.password).then(isMatch => {
          if (isMatch) {
            const id = user;
            const {  username, email , number, fullname } = user.local;
            const payload = {  username, email , number , fullname };
            // Sign Token
            const token = signToken(new UserModel(req.body),payload,keys.secretOrKey);
    res.status(200).send({ token });
          } else {
            return res.status(401);
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


module.exports = router ; 