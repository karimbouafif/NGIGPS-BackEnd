const router = require('express').Router();
const { MissionModel, UserModel } = require('../../models');
const passport = require('passport');
const { upload } = require('../../utils/Uploader');


/* GET By  Mission Type . 
@Route : mission/
*/
router.get('/missiontype', (req, res) => {
  const missions = MissionModel.find({ type: 'Haut' });
  missions.exec().then(data => {
    res.json(data);
  });
});

/* GET All Mission . 
@Route : mission/
*/
router.get('/', (req, res) => {
  MissionModel.find()
    .populate('user')
    .sort('-start')
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
    .sort('-start')
    .limit(3)
    .then((data) => {
      return res.json(data);
    })
    // .catch((err) => res.send(err));
    .catch(error => { 
      console.log('caught', error.message); 
    });
});

/*Select count Mission By User
@Route : missions/iduser
*/
router.get('/iduser', (req, res) => {
  const query = {
    _id: req.params.id,
  };

  MissionModel
   .count({taskStatus: 'waiting'})

    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.send(err));
});



/* GET Single Missions. 
@Route : missions/:id
*/
router.get('/:id', (req, res) => {
  const query = {
    _id: req.params.id,
  };
  //MissionModel.count({taskStatus: 'waiting'})
  MissionModel.find({user:req.params.id})
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
  //passport.authenticate('jwt', { session: false }),
  (req, res) => {
    newMission = new MissionModel({
      taskTitle: req.body.taskTitle,
      taskTime: req.body.taskTime,
      start_adress:" 8.71472,36.18222",
      taskStatus:"waiting",
      end_adress: "11.098248577,36.844353618",
      taskContent: req.body.taskContent,
      priorityIs: req.body.priorityIs,
      archived: false,
      url: req.body.url,
      isCompleted:false,
      isUpdated:false,
     // image: req.file.path,
      user: req.body.user,
      email:req.body.email,
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
        start: req.body.start,
        end: req.body.end,
        taskContent: req.body.taskContent,
        type: req.body.type,
        url: req.body.url,
        image: req.file.path,
        user: req.body.user,
      };
    } else {
      missionUpdated = {
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        summary: req.body.summary,
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
  //passport.authenticate('jwt', { session: false }),
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
router.put('/completed/:id', (req, res) => {
  let query = {
    _id: req.params.id,
  };
  MissionModel.findOneAndUpdate(
    query,
    {
      $set: { isCompleted: true },
    },
    { new: true }
  )
    .then((mission) => res.json(mission))
    .catch((err) => res.status(400).json(err));
});
router.put('/incompleted/:id', (req, res) => {
  let query = {
    _id: req.params.id,
  };
  MissionModel.findOneAndUpdate(
    query,
    {
      $set: { isCompleted: false },
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
