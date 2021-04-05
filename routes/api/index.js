const router = require('express').Router();

const userRoutes = require('./users');
const profileRoutes = require('./profile');
const postsRoutes = require('./posts');
const missionsRoutes = require('./missions');
const voituresRoutes= require('./voitures');

router.get('/', (req, res) => {
  res.send({
    success: true,
  });
});
router.use('/posts', postsRoutes);
router.use('/profile', profileRoutes);
router.use('/users', userRoutes);
router.use('/missions',missionsRoutes);
router.use('/voitures',voituresRoutes);



module.exports = router;
