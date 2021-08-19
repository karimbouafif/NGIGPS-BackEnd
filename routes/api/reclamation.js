const express = require('express');
const router = express.Router();
const { ReclamationModel } = require('../../models');

// @route    GET api/reclamation/test
// @desc     Tests reclamation route 
// @access   Public 
router.get('/test', (req,res) =>res.json({msg : 'reclamation works'}));




/* Add reclamation .
@Route : reclamation/add + body {} without jwt 
*/
router.post(
    '/addReclamation',
    (req, res) => {
        var newReclamation;
        if (req.file) {
            newReclamation = new ReclamationModel({
            
                titre:req.body.titre,
                description:req.body.description,
                cause:req.body.cause,
                user: req.body.user,
                mission:req.body.mission,
                isCompleted:false,

            });
        }
        else{
            newReclamation = new ReclamationModel({
              titre:req.body.titre,
                description:req.body.description,
                cause:req.body.cause,
                user: req.body.user,
                mission:req.body.mission,
                isCompleted:false,
              
            });
        }
        newReclamation
            .save()
            .then((reclamation) => res.json(reclamation))
            .catch((err) => res.status(400).json(err));
    }
);



/* GET Single Missions. 
@Route : reclamations/:id
*/
router.get('/:id', (req, res) => {
    const query = {
      _id: req.params.id,
    };
 
    ReclamationModel.find({user:req.params.id})
      .populate('user')
      .then((data) => {
        res.json(data);
      })
      .catch((err) => res.send(err));
  });

/* GET All Mission . 
@Route : mission/
*/
router.get('/', (req, res) => {
    ReclamationModel.find()
      .populate('user')
      .then((data) => {
        res.json(data);
      })
      .catch((err) => res.send(err));
  });
  





module.exports = router;