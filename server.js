const express =require('express');
const mongoose =require('mongoose');
const bodyParser =require('body-parser');
const passport  = require('passport');
const UserModel = require("./models/model.user");

const users = require('./routes/api/users');
const profile =require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app =express();
let server = require('http').createServer(app);
//Body parser middleware 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose.set('useUnifiedTopology', true);
//db Config 
require('dotenv').config({ path: 'env.txt' });

//Connect to MongoDB 

mongoose
        .connect(process.env.MONGO_URI, {useNewUrlParser:true })
        .then(()=> console.log('MongDb connected'))
        .catch(err=> console.log(err));

//Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());
//Passport Config 
require('./config/passport')(passport);

passport.serializeUser(function(user, cb) {
        cb(null, user.id);
      });
      
      passport.deserializeUser(function(id, cb) {
        UserModel.findById(id, function(err, user) {
          cb(err, user);
        });
      });


//USE ROUTES

app.use('/api', require('./routes/api'));

const port = process.env.port || 4000 ; 

app.listen(port,()=>console.log(`Server running on port ${port}`));