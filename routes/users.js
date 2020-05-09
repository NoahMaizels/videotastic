
const express = require('express');
const usersController = require('../controllers/users');
const router = express.Router();

router.get('/all', usersController.getUsers)
router.get('/:id', usersController.getUser)
router.post('/:id/delete', usersController.deleteUser)
router.post('/', usersController.createUser);

module.exports = router;
