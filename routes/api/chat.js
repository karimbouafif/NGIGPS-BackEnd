const router = require('express').Router();
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const User = require("../../models/model.user");
const { ChatModel } = require('../../models');


//New chat message API
router.post("/chats", (req, res) => {
    const query = ChatModel.findOne({
      $or: [
        { reciever: req.body.reciever, sender: req.body.sender },
        { reciever: req.body.sender, sender: req.body.reciever }
      ]
    });
    query
      .exec()
      .then(data => {
        if (data === null) {
          const chat = new ChatModel({
            sender: req.body.sender,
            reciever: req.body.reciever,
            messages: req.body.messages
          });
  
          chat
            .save()
            .then(data => {
              res.json(data);
            })
            .catch(error => {
              res.json(error);
            });
        } else {
          const updateChat = ChatModel.updateOne(
            {
              $or: [
                { reciever: req.body.reciever, sender: req.body.sender },
                { reciever: req.body.sender, sender: req.body.reciever }
              ]
            },
            { $set: { messages: req.body.messages } }
          );
          updateChat
            .exec()
            .then(data => {
              res.json(data);
            })
            .catch(error => {
              res.json(error);
            });
        }
      })
      .catch(error => {
        res.json(error);
      });
  });


//Chat messages getter API
router.get("/chats/:sender/:reciever", (req, res) => {
    const chat = ChatModel.findOne({
      $or: [
        { reciever: req.params.reciever, sender: req.params.sender },
        { reciever: req.params.sender, sender: req.params.reciever }
      ]
    });
  
    chat.exec().then(data => {
      if (data === null) {
        res.json([]);
      } else {
        res.json(data.messages);
      }
    });
  });
  
  //Chatrooms getter API
  router.get("/chats/:userId", (req, res) => {
    const chat = ChatModel.find({
      $or: [{ reciever: req.params.userId }, { sender: req.params.userId }]
    });
  
    chat.exec().then(data => {
      if (data.length === 0) {
        res.json([]);
      } else {
        res.json(data);
      }
    });
  });
  











module.exports = router;
