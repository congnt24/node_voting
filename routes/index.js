/**
 * Created by apple on 6/29/17.
 */
var express = require('express')
var router = express.Router()
var Poll = require('../models/poll')


router.use('/user', require('./user'))

router.get('/', function (req, res, next) {
    Poll.all(100, (err, doc) => {
        if (err) {
            //render jade
            res.render('index', {title: 'Home', items: ['asdasd', 'asdasdsad']})
        } else {
            //render jade
            res.render('index', {title: 'Home', items: doc})
        }
    })
})



router.get('/poll/:poll_id', function (req, res, next) {
    if (req.query.index && (req.session.user || req.query.user)) {
        //update data to db
        Poll.update(req.params.poll_id, req.query.index, req.session.user?req.session.user:req.query.user, (err, doc) => {
            if (err != null) {
                res.send({status: 'error'})
                return
            }
            console.log('success');
            res.send({status: 'success'})

        })
    }else {
        Poll.findPollById(req.params.poll_id, (err, doc) => {
            if (err) {
                res.sendStatus(404)
            } else {
                res.render('polldetail', {poll: doc})
            }

        })
    }
})

router.get('/delete/:id', function (req, res, next) {
    Poll.remove(req.params.id, (err, done) => {
        if (err) {
            res.sendStatus(404)
        }else{
            res.redirect('/')
        }
    })
})



module.exports = router