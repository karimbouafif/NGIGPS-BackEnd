
const router = require('express').Router();
const { BroadcastModel } = require('../../models');
const passport = require('passport');
const { Router } = require('express');


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