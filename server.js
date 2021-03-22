const express =require('express');
const mongoose =require('mongoose');
const bodyParser =require('body-parser');
const passport  = require('passport');


const users = require('./routes/api/users');
const profile =require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app =express();

//Body parser middleware 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//db Config 
require('dotenv').config({ path: 'env.txt' });

//Connect to MongoDB 

mongoose
        .connect(process.env.MONGO_URI, {useNewUrlParser:true })
        .then(()=> console.log('MongDb connected'))
        .catch(err=> console.log(err));

//Passport Middleware 
app.use(passport.initialize());

//Passport Config 
require('./config/passport')(passport);


//USE ROUTES

app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);


const port = process.env.port || 4000 ; 

app.listen(port,()=>console.log(`Server running on port ${port}`));