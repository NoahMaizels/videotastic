
const express = require('express');
const videosController = require('../controllers/videos');
const router = express.Router();

router.get('/:id', videosController.getVideo )
router.post('/', videosController.postVideo);
// router.post('/', (req, res, next) => {res.send('hit')});
module.exports = router;
