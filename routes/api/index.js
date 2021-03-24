const router = require('express').Router();

const userRoutes = require('./users');
const profileRoutes = require('./profile');
const postsRoutes = require('./posts');

router.get('/', (req, res) => {
  res.send({
    success: true,
  });
});
router.use('/posts', postsRoutes);
router.use('/profile', profileRoutes);
router.use('/users', userRoutes);


module.exports = router;
