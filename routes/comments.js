
const express = require('express');
const commentsController = require('../controllers/comments');
const router = express.Router();
const auth = require('../auth')

router.get('/all', auth.ensureUser, commentsController.getAll)
router.get('/:id', commentsController.get)
router.post('/:id/delete', commentsController.delete)
router.post('/edit', commentsController.edit)
router.post('/', commentsController.create);

module.exports = router;
