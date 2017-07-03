/**
 * Created by apple on 6/30/17.
 */
"use strict";
var db = require('../db')
var obj = require('mongodb').ObjectID
var Arr = require('../utilities/utility').Arr

const collection = 'poll'

let poll = {
    EMAIL: '',
    QUESTION: '',
    OPTIONS: [],
    RATES: [],
    USERS: []
}

var repo = {}

repo.all = (limit, done) => {
    db.get().collection(collection).find({}).limit(limit).toArray((err, doc) => {
        done(err, doc)
    })
}

repo.create = (email, question, options, done) => {
    poll.QUESTION = question
    poll.OPTIONS = options
    poll.EMAIL = email
    poll.RATES = Array(options.length).fill(0)
    poll.USERS = Array(options.length).fill([])

    db.get().collection(collection).insertOne(poll, (err, doc) => {
        done(err, doc)
    })
}

repo.update = (poll_id, index, user, done) => {
    repo.findPollById(poll_id, (err, doc) => {
        if (err) {
            done(1)
            return
        }
        let rates = doc.RATES
        let newRate = rates[index] + 1
        //user
        var users = doc.USERS
        if (Arr.flatten(users).indexOf(user) == -1) {
            users[index].push(user)
            rates.splice(index, 1, newRate)
            db.get().collection(collection).updateOne({_id: new obj(poll_id)}, {$set: {RATES: rates, USERS: users}}, (err2, doc2) => {
                done(err2, doc2)
            })
        } else {
            done(1)
        }
    })
}

repo.remove = (id, done) => {
    db.get().collection(collection).deleteOne({_id: new obj(id)}, (err, doc) => {
        console.log(doc);
        done(err, doc)
    })
}

repo.findPollById = (poll_id, done) => {
    db.get().collection(collection).findOne({_id: new obj(poll_id)}, (err, doc) => {
        done(err, doc)
    })
}

repo.findByEmail = (email, done) => {
    db.get().collection(collection).find({EMAIL: email}).toArray((err, doc) => {
        done(err, doc)
    })
}

module.exports = repo