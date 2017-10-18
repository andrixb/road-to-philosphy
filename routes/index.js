var express = require('express');
var router = express.Router();

const crtl = require('../controllers');
const URL = 'https://en.wikipedia.org/wiki';

/* GET home page. */
router.get('/:article', function(req, res, next) {
    var visited = [];
    
    res.render('index', { title: 'Wikipeda - Get to Philosophy' });
    crtl(`${URL}/${req.params.article}`, visited);
    console.log('=====>', visited)
});

module.exports = router;
