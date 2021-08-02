const router = require('express').Router();
const { VoitureModel } = require('../../models');
const passport = require('passport');
const { upload } = require('../../utils/Uploader');





/* GET 3 Latest Affectation Voitures. 
@Route : voitures/
*/
router.get('/latest', (req, res) => {
    VoitureModel.find()
      .sort('-createdAt')
      .limit(3)
      .then((data) => {
        return res.json(data);
      })
      // .catch((err) => res.send(err));
      .catch(error => { 
        console.log('caught', error.message); 
      });
  });
  




/* GET All voitures .
@Route : voitures/
*/
router.get('/', (req, res) => {
    VoitureModel.find()
        .populate('user')
        .sort('-date')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => res.send(err));
});

/* GET Single voitures .
@Route : voitures/:id
*/
router.get('/:id', (req, res) => {
    const query = {
        _id: req.params.id,
    };

    VoitureModel.findOne(query)
        .populate('user')
        .populate('mission')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => res.send(err));
});


/* Add voitures .
@Route : voitures/add + body {} without jwt 
*/
router.post(
    '/addCar',
    upload.single('imageData'),
    (req, res) => {
        var newVoiture;
        if (req.file) {
            newVoiture = new VoitureModel({
                title: req.body.title,
                description: req.body.description,
                type: req.body.type,
                archived: false,
                user: req.body.user,
                matricule: req.body.matricule,
                etat: req.body.etat,
                disponibilite: req.body.disponibilite,
                image:"uploads\1624385379961Logo.png",


            });
        }
        else{
            newVoiture = new VoitureModel({
                title: req.body.title,
                description: req.body.description,
                type: req.body.type,
                archived: false, 
                matricule: req.body.matricule,
                etat: req.body.etat,
                disponibilite: req.body.disponibilite,
                image:"uploads\1624385379961Logo.png",

              
            });
        }
        newVoiture
            .save()
            .then((voiture) => res.json(voiture))
            .catch((err) => res.status(400).json(err));
    }
);


/* Add voitures .
@Route : voitures/add + body {}
*/

router.post(
    '/add',
    upload.single('imageData'),
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        var newVoiture;
        if (req.file) {
            newVoiture = new VoitureModel({
                title: req.body.title,
                description: req.body.description,
                type: req.body.type,
                archived: false,
                user: req.body.user,
                matricule: req.body.matricule,
                etat: req.body.etat,
                disponibilite: req.body.disponibilite,
                image: "image",


            });
        }
        else{
            newVoiture = new VoitureModel({
                title: req.body.title,
                description: req.body.description,
                type: req.body.type,
                archived: false,
                user: req.body.user,
                matricule: req.body.matricule,
                etat: req.body.etat,
                disponibilite: req.body.disponibilite,
            });
        }
        newVoiture
            .save()
            .then((voiture) => res.json(voiture))
            .catch((err) => res.status(400).json(err));
    }
);

/* UPDATE Single voitures.
@Route : voitures/update/:id
*/
router.put(
    '/update/:id',
    upload.single('imageData'),
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const query = {
            _id: req.params.id,
        };

        let voitureUpdated;
        if (req.file) {
            voitureUpdated = {
                title: req.body.title,
                description: req.body.description,
                type: req.body.type,
                archived: false,
                image: req.file.path,
                user: req.body.user,
                matricule: req.body.matricule,
                etat: req.body.etat,
                disponibilite: req.body.disponibilite,      };
        } else {
            voitureUpdated = {
                title: req.body.title,
                description: req.body.description,
                type: req.body.type,
                archived: false,
                user: req.body.user,
                matricule: req.body.matricule,
                etat: req.body.etat,
                disponibilite: req.body.disponibilite,      };
        }

        VoitureModel.findOneAndUpdate(
            query,
            {
                $set: voitureUpdated,
            },
            { new: true }
        )
            .then((voiture) => res.json(voiture))
            .catch((err) => res.status(400).json(err));
    }
);

/* DELETE Single Voiture.
@Route : voitures/delete/:id
*/
router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let query = {
            _id: req.params.id,
        };
        VoitureModel.deleteOne(query)
            .then((voiture) => res.json(voiture))
            .catch((err) => res.status(400).json(err));
    }
);

router.put('/archive/:id', (req, res) => {
    let query = {
        _id: req.params.id,
    };
    VoitureModel.findOneAndUpdate(
        query,
        {
            $set: { archived: true },
        },
        { new: true }
    )
        .then((voiture) => res.json(voiture))
        .catch((err) => res.status(400).json(err));
});

router.put('/unarchive/:id', (req, res) => {
    let query = {
        _id: req.params.id,
    };
    VoitureModel.findOneAndUpdate(
        query,
        {
            $set: { archived: false },
        },
        { new: true }
    )
        .then((voiture) => res.json(voiture))
        .catch((err) => res.status(400).json(err));
});

module.exports = router;
