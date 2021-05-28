const router = require('express').Router();
const { MissionModel } = require('../../models');
const passport = require('passport');
const { upload } = require('../../utils/Uploader');




/* GET All Mission . 
@Route : mission/
*/
router.get('/', (req, res) => {
  MissionModel.find()
    .populate('user')
    .sort('-dateStart')
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.send(err));
});

/* GET 3 Latest Missions. 
@Route : missions/
*/
router.get('/latest', (req, res) => {
  MissionModel.find()
    .sort('-dateStart')
    .limit(3)
    .then((data) => {
      return res.json(data);
    })
    // .catch((err) => res.send(err));
    .catch(error => { 
      console.log('caught', error.message); 
    });
});

/* GET Single Missions. 
@Route : missions/:id
*/
router.get('/:id', (req, res) => {
  const query = {
    _id: req.params.id,
  };
  MissionModel.findOne(query)
    .populate('user')
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.send(err));
});

/* Add Mission . 
@Route : mission/add + body {}
*/

// second parameter upload.single('missionImage');
router.post(
  '/add',
  upload.single('imageData'),
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    newMission = new MissionModel({
      title: req.body.title,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      start_adress:req.body.start_adress,
      end_adress:req.body.end_adress,
      description: req.body.description,
      type: req.body.type,
     // archived: false,
      url: req.body.url,
    //  image: "image",
      user: req.body.user,
    });

    newMission
      .save()
      .then((mission) => res.json(mission))
      .catch((err) => res.status(400).json(err));
  }
);

/* UPDATE Single Mission. 
@Route : missions/update/:id
*/
router.put(
  '/update/:id',
  upload.single('imageData'),
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const query = {
      _id: req.params.id,
    };

    let missionUpdated;
    if (req.file) {
      missionUpdated = {
        title: req.body.title,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
        description: req.body.description,
        type: req.body.type,
        url: req.body.url,
        image: req.file.path,
        user: req.body.user,
      };
    } else {
      missionUpdated = {
        title: req.body.title,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
        description: req.body.description,
        type: req.body.type,
        url: req.body.url,
        user: req.body.user,
      };
    }

    MissionModel.findOneAndUpdate(
      query,
      {
        $set: missionUpdated,
      },
      { new: true }
    )
      .then((mission) => res.json(mission))
      .catch((err) => res.status(400).json(err));
  }
);

/* DELETE Single Mission. 
@Route : missions/delete/:id
*/
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let query = {
      _id: req.params.id,
    };
    MissionModel.deleteOne(query)
      .then((mission) => res.json(mission))
      .catch((err) => res.status(400).json(err));
  }
);

router.put('/archive/:id', (req, res) => {
  let query = {
    _id: req.params.id,
  };
  MissionModel.findOneAndUpdate(
    query,
    {
      $set: { archived: true },
    },
    { new: true }
  )
    .then((mission) => res.json(mission))
    .catch((err) => res.status(400).json(err));
});

router.put('/unarchive/:id', (req, res) => {
  let query = {
    _id: req.params.id,
  };
  MissionModel.findOneAndUpdate(
    query,
    {
      $set: { archived: false },
    },
    { new: true }
  )
    .then((mission) => res.json(mission))
    .catch((err) => res.status(400).json(err));
});

module.exports = router;
