/**
 * Created by apple on 6/29/17.
 */

"use strict";
var express = require('express')
var Twitter = require('node-twitter-api'), config = require("../configs/config");
var User = require('../models/user')




var router = express.Router()

//setup twitter
var twitter = new Twitter({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callback: config.twitter.callbackUrl
});


router.get('/', function (req, res, next) {
    res.render('index', {title: "Express", items: ['asdasd', 'asdasdsad']})
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
                        if (err) {
                            //if not have in db, save to db
                            User.create(user.screen_name, '', user.name, user.name, user.name, function (err, docs) {
                                if (err) {
                                    res.status(500).send(err)
                                } else {
                                    //save session
                                    req.session.user = docs.ops[0].EMAIL
                                    req.session.save()
                                    res.redirect('/')
                                }
                            })
                        }
                        else {
                            //login
                            req.session.user = docs.EMAIL
                            req.session.save()
                            res.redirect('/')
                        }
                    })
                }
            })
        }
    })
})

router.get('/signout', function(req, res, next){
    if (req.session && req.session.user) {
        delete req.session.user
    }
    res.redirect('/')
})

module.exports = router