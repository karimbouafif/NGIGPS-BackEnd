const router = require('express').Router();
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


const Chat = require("../../models/model.chat");
const { BroadcastModel } = require('../../models');

//New Broadcast Messages API
router.post("/broadcast", (req, res) => {
    const broadcast = new BroadcastModel(req.body);
  
    broadcast
      .save()
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        res.json(error);
      });
  });
  
  //Broadcast Message getter API
  router.get("/broadcast", (req, res) => {
    const chat = BroadcastModel.find();
  
    chat.exec().then(data => {
      if (data === null) {
        res.json(data);
      } else {
        res.json(data);
      }
    });
  });
  










module.exports = router;
