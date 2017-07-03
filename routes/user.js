/**
 * Created by apple on 6/29/17.
 */

"use strict";
var express = require('express')
var Twitter = require('node-twitter-api'), config = require("../configs/config");
var User = require('../models/user')
var Poll = require('../models/poll')




var router = express.Router()

//setup twitter
var twitter = new Twitter({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callback: config.twitter.callbackUrl
});


router.get('/', function (req, res, next) {
    console.log(req.session.user);
    if (req.session.user) {
        Poll.findByEmail(req.session.user, (err, doc) => {
            if (err) {
                return null
            }
            console.log(doc)
            res.render('index', {title: "Express", items: doc})

        })
    }else {
        res.render('index', {title: "Express", items: ['asdasd', 'asdasdsad']})
    }

})

var _requestSecret
router.get('/request-token', function (req, res, next) {
    twitter.getRequestToken(function (err, requestToken, requestSecret) {
        if (err)
            res.status(500).send(err)
        else {
            _requestSecret = requestSecret
            res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken)
        }
    });
})


//handle redirect to access token
router.get('/access-token', function (req, res, next) {
    var oauth_verifier = req.query.oauth_verifier
    var requestToken = req.query.oauth_token
    twitter.getAccessToken(requestToken, _requestSecret, oauth_verifier, function (err, accessToken, accessSecret) {
        if (err) {
            res.status(500).send(err)
        }
        else {
            twitter.verifyCredentials(accessToken, accessSecret, function (err, user) {
                if (err) {
                    res.status(500).send(err)
                } else {
                    User.find(user.screen_name, function (err, docs) {
                        if (err || docs == null) {
                            //if not have in db, save to db
                            User.create(user.screen_name, '', user.name, user.name, user.name, function (err, docs) {
                                if (err) {
                                    res.status(500).send(err)
                                } else {
                                    //save session
                                    req.session.user = docs.ops[0].EMAIL
                                    res.redirect('/')
                                }
                            })
                        } else {
                            //login
                            req.session.user = docs.EMAIL
                            res.redirect('/')
                        }

                        req.session.accessToken = accessToken
                        req.session.accessSecret = accessSecret
                        req.session.save()
                    })
                }
            })
        }
    })
})

//create poll
router.get('/createpoll', function (req, res, next) {
    if (req.session.user) {
        res.render('createpoll')
    }else{
        res.sendStatus(201)
    }
})

router.post('/createpoll', function (req, res, next) {
    if (req.session.user && req.body) {
        Poll.create(req.session.user, req.body.question
            , req.body.options.split(/\r*\n/), (err, doc) => {
            if (err) {
                res.sendStatus(500)
            }
            res.redirect('/')
        })
    }else{
        next()
    }
})


router.get('/signout', function(req, res, next){
    if (req.session && req.session.user) {
        delete req.session.user
    }
    res.redirect('/')
})

module.exports = router