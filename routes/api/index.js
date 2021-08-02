const router = require('express').Router();

const userRoutes = require('./users');
const profileRoutes = require('./profile');
const postsRoutes = require('./posts');
const missionsRoutes = require('./missions');
const voituresRoutes= require('./voitures');
const chatsRoutes = require('./chats');
const broadcastsRoutes = require('./broadcast');
const notificationsRoutes = require('./notifications')


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
router.use('/chats',chatsRoutes);
router.use('/broadcasts',broadcastsRoutes);
router.use('/notifications',notificationsRoutes);


module.exports = router;
