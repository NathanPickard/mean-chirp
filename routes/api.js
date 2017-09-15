var express = require('express');
var router = express.Router();

router.route('/posts')

  .get(function (req, res) {
    res.send({ message: 'TODO return all posts' });
  })
  .post(function (req, res) {
    res.send({ message: 'TODO Create a new post' })
  });

module.exports = router;