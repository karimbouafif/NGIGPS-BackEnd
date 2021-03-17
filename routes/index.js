const router = require('express').Router();

const userRoutes = require('./user.route');

router.get('/', (req, res) => {
  res.send({
    success: true,
  });
});

router.use('/user', userRoutes);

module.exports = router;
