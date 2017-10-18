const express = require('express');
const router = express.Router();
const articleCrtl = require('../controllers');
const observeService = require('../services/observe.service'); 

const URL = 'https://en.wikipedia.org/wiki';

router.get('/', function (req, res, next) {
    res.render('index', { title: 'The Long Road to Find Philosophy' });
});

router.get('/:article', function (req, res, next) {
    articleCrtl(`${URL}/${req.params.article}`)
    
    observeService.on('calculated', function (data) {
        res.json(data);
        next();
    });

    observeService.on('error', function (message) {
        // res.render('error', { error: message });
    });
});

module.exports = router;
