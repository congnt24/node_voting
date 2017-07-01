/**
 * Created by apple on 6/29/17.
 */
var express = require('express')
var router = express.Router()
var Poll = require('../models/poll')


router.use('/user', require('./user'))

router.get('/', function (req, res, next) {
    //render jade
    res.render('index', {title: 'Hello world', items: ['asdasd', 'asdasdsad']})
})



router.get('/poll', function (req, res, next) {
    Poll.create('male or female?', [{option: 'male', rate: 0}, {option: 'female', rate: 0}])
})


module.exports = router