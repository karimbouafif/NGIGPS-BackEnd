
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
const keys = require('./config/keys');
const http =require('http');
let app = express();
const socketIo = require("socket.io");
const server = http.createServer(app); //Create server with express
const io = socketIo(server);


//const User = require("./models/User");
const {UserModel} = require('./models');



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

var clients = []; //connected clients

io.on("connection", socket => {
  console.log("New User Connected");
  socket.on("storeClientInfo", function(data) {
    console.log(data.customId + " Connected");
    //store the new client
    var clientInfo = new Object();
    clientInfo.customId = data.customId;
    clientInfo.clientId = socket.id;
    clients.push(clientInfo);

    //update the active status
    const res = User.updateOne({ id: data.customId }, { isActive: true });
    res.exec().then(() => {
      console.log("Activated " + data.customId);

      //Notify others
      socket.broadcast.emit("update", "Updated");
      console.log("emmited");
    });
  });

  socket.on("disconnect", function(data) {
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];

      if (c.clientId == socket.id) {
        //remove the client
        clients.splice(i, 1);
        console.log(c.customId + " Disconnected");

        //update the active status
        const res = User.updateOne({ id: c.customId }, { isActive: false });
        res.exec().then(data => {
          console.log("Deactivated " + c.customId);

          //notify others
          socket.broadcast.emit("update", "Updated");
        });
        break;
      }
    }
  });
});

//Messages Socket
const chatSocket = io.of("/chatsocket");
chatSocket.on("connection", function(socket) {
  //On new message
  socket.on("newMessage", data => {
    //Notify the room
    socket.broadcast.emit("incommingMessage", "reload");
  });
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