
const express = require('express');
const usersController = require('../controllers/users');
const router = express.Router();

router.get('/all',  usersController.getAll)
router.get('/get/:id', usersController.get)
router.post('/:id/delete', usersController.delete)
router.post('/edit', usersController.edit)
router.post('/', usersController.create);

module.exports = router;
