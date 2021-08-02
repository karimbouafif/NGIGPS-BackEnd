
require('dotenv').config({ path: 'env.txt' });


const express = require('express');
const logger = require('morgan');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
//const UserModel = require("./models/model.user");
const userRoutes =require('./routes/api/users')
const keys = require('./config/keys');
const http =require('http');
let app = express();
const socketIo = require("socket.io");
const dummyDb = { subscription: null };


//const User = require("./models/User");
const {UserModel} = require('./models');
/*
const Pusher = require('pusher');

const PushNotifications = require('@pusher/push-notifications-server');


const pusher = new Pusher({
  appId: "1213426",
  key: "9dabad3492f123ba6106",
  secret: "00ed3a825fbb6333bc38",
  cluster: "eu",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
  message: "test ngi"
});

*/

const server = http.createServer(app);




let mongoUrl = keys.mongoURI;

mongoose.set('useUnifiedTopology', true);

mongoose
  .connect(mongoUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false 
  })
  .then(() => {
    console.log('Connected to Local MongoDB');
  })
  .catch(err => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    process.exit();
  });
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Passport Config
require('./config/passport')(passport);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  UserModel.findById(id, function(err, user) {
    cb(err, user);
  });
});

app.set('port', process.env.SERVER_PORT || 4000);
// allow-cors
app.use(cors());

app.use(logger('tiny'));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(methodOverride());
app.use(cookieParser());

// ******************* call all routes ***************************
app.use('/uploads',express.static('uploads'))
app.use('/api', require('./routes/api'));


const sendNotification = (subscription, dataToSend = "") => {
  webpush.sendNotification(subscription, dataToSend);
};

const saveToDatabase = async subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription;
};
// The new /save-subscription endpoint
app.post("/save-subscription", async(req, res) => {
  const subscription = req.body;
  await saveToDatabase(subscription); //Method to save the subscription to Database
  res.json({ message: "success" });
});

//route to test send notification
app.get("/send-notification", (req, res) => {
  const subscription = dummyDb.subscription; //get subscription from your databse here.
  const message = "Hello World from server";
  sendNotification(subscription, message);
  res.json({ message: "message sent" });
});




const io = socketIo(server)

io.on("connection", function(socket) {
    // This event will trigger when any user is connected.
    // You can use 'socket' to emit and receive events.
    console.log("a user connected.");
});









// error handling middleware should be loaded after loading the routes
app.use(errorHandler());

server.listen(app.get('port'), error => {
  if (error) {
    //console.error(`\n${error}`);
    server.close();
    process.exit(1);
  }
  console.log(`Server Listening at http://localhost:${app.get('port')}/`);
});