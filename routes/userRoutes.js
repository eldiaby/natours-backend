const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController.js');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMe', authController.prodect, userController.updateMe);

router.delete('/deleteMe', authController.prodect, userController.deleteMe);

router.patch(
  '/updateMyPassword',
  authController.prodect,
  authController.updatePassword
);

router
  .route('/')
  .get(authController.prodect, userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
