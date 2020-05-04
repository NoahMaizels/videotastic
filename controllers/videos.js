const Video = require('../models/video');

exports.postVideo = (req, res, next) => {

  const title = req.body.title;
  const description = req.body.description;
  const video = new Video(null, title, description);
  video
    .save()
    .then(res.redirect('/'))
    .catch(err => console.log(err));
};

exports.getVideo = (req, res, next) => {
  const id = req.params.id
  Video.findById(id)
    .then(result => {
      res.send(result[0][0])
    })
}