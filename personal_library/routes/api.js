/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
// var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
    if (err) throw err;
    console.log('Connected successfully to db server');
    
    app
      .route('/api/books')
      .get(function(req, res) {
        //response will be array of book objects
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

        db.collection('library')
          .find({})
          .toArray((err, docs) => {
            if (err) throw err;

            // Create response data
            const parsedArray = [];
            docs.forEach(obj => {
              parsedArray.push({
                _id: obj._id,
                title: obj.title,
                commentcount: obj.comments ? obj.comments.length : 0
              });
            });

            res.json(parsedArray);
          });
      })
      .post(function(req, res) {
        var title = req.body.title;
        //response will contain new book object including atleast _id and title
        if (!title) {
          res.send('missing title');
        } else {
          db.collection('library').insertOne({ title: title, comments: [] }, (err, r) => {
            if (err) throw err;
            res.json(r.ops[0]);
          });
        }
      })
      .delete(function(req, res) {
        //if successful response will be 'complete delete successful'
        db.collection('library').deleteMany((err, reply) => {
          if (err) throw err;
          if (reply) {
            res.send('complete delete successful');
          }
        });
      });

    app
      .route('/api/books/:id')
      .get(function(req, res) {
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

        var bookid = req.params.id;        

        if (ObjectId.isValid(bookid)) {
          db.collection('library').findOne({ _id: ObjectId(bookid) }, (err, doc) => {
            if (err) throw err;
            if (doc) {
              res.json(doc);
            } else {
              res.send('no book exists');  
            }            
          });
        } else {
          res.send('no book exists');
        }
      })

      .post(function(req, res) {
        var bookid = req.params.id;
        var comment = req.body.comment;
        const id = ObjectId(bookid);

        //json res format same as .get      
        db.collection('library').findOneAndUpdate({ _id: id}, { $push: { comments: comment }}, { returnOriginal: false}, (err, r) => {
          if (err) throw err;
          res.json(r.value);
        });
      })

      .delete(function(req, res) {
        var bookid = req.params.id;
        //if successful response will be 'delete successful'
        db.collection('library').deleteOne({ _id: ObjectId(bookid) }, (err, result) => {
          if (err) throw err;
          if (result.deletedCount === 1) {
            res.send('delete successful');
          } else {
            res.send('Something went wrong');  
          }          
        });
      });

    //404 Not Found Middleware
    app.use(function(req, res, next) {
      res
        .status(404)
        .type('text')
        .send('Not Found');
    });
  });
};
