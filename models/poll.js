/**
 * Created by apple on 6/30/17.
 */
"use strict";
var db = require('../db')
let collection = 'poll'

let poll = {
    EMAIL: '',
    QUESTION: '',
    OPTIONS: [{option: '', rate: 0}]
}

var repo = {}

repo.all = (limit, done) => {
    db.get().collection(collection).find({}).limit(limit).toArray((err, doc) => {
        console.log(doc);
    })
}

repo.create = (email, question, options) => {
    poll.QUESTION = question
    poll.OPTIONS = options
    poll.EMAIL = email

    db.get().collection(collection).insertOne(poll, (err, doc) => {
        console.log(doc);
    })
}

module.exports = repo