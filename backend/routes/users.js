
const express = require('express');
const usersController = require('../controllers/users');
const router = express.Router();

router.get('/:id', usersController.getUser)
router.post('/:id/delete', usersController.deleteUser)

router.post('/', usersController.postUser);

module.exports = router;
