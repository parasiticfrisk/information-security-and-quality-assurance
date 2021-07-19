/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  MongoClient.connect(CONNECTION_STRING, function(err, db) {
    if (err) throw err;
    console.log('Connected successfully to db server');

    app
      .route('/api/issues/:project')

      .get(function(req, res) {
        var project = req.params.project;
        const queries = {};

        // Create object for mongodb lookup
        Object.keys(req.query).forEach(key => {
          if (req.query[key] === 'true') {
            queries[key] = true;
          } else if (req.query[key] === 'false') {
            queries[key] = false;
          } else if (key === '_id') {
            queries[key] = ObjectId(req.query[key]);
          } else {
            queries[key] = req.query[key];
          }
        });

        db.collection(project)
          .find(queries)
          .toArray((err, docs) => {
            if (err) throw err;
            res.json(docs);
          });
      })

      .post(function(req, res) {
        var project = req.params.project;
        const issue = {
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text,
          created_on: new Date().toISOString(),
          updated_on: new Date().toISOString(),
          open: true
        };

        if (!issue.issue_title || !issue.issue_text || !issue.created_by) {
          res.send('Title, text, and created by fields are required');
        } else {
          db.collection(project).insertOne(issue, (err, r) => {
            if (err) throw err;
            res.json(r.ops[0]);
          });
        }
      })

      .put(function(req, res) {
        // Ensure id is valid
        if (!ObjectId.isValid(req.body._id)) {
          res.send('ObjectId ' + req.body._id + ' is invalid.');
        } else {
          const project = req.params.project;

          // Create object for updates
          // Change true/false strings to booleans
          // Filter out _id
          // Add only truthy values
          const updates = {};
          Object.keys(req.body).forEach(key => {
            if (req.body[key] === 'false') {
              updates[key] = false;
            } else if (req.body[key] && key !== '_id') {
              updates[key] = req.body[key];
            }
          });

          // Add the updated date
          updates.updated_on = new Date().toISOString();

          // Ensure object has more than just the updated_on prop
          // update if exists in database
          if (Object.keys(updates).length > 1) {
            db.collection(project).updateOne({ _id: ObjectId(req.body._id) }, { $set: updates }, (err, results) => {
              if (err) throw err;

              if (!results.matchedCount) {
                res.send('No Id in database');
              } else if (results.modifiedCount) {
                res.send('Update successful!');
              } else {
                res.send('Something went wrong');
              }
            });
          } else {
            res.send('no updated field sent');
          }
        }
      })

      .delete(function(req, res) {
        const project = req.params.project;
        
      if (!req.body._id) {
          res.send('_id error');
        } else if (ObjectId.isValid(req.body._id)) {
          db.collection(project).deleteOne({ _id: ObjectId(req.body._id) }, (err, result) => {
            if (err) throw err;

            if (result.deletedCount === 1) {
              res.json({ success: 'deleted ' + req.body._id });
            } else {
              res.json({ failed: 'could not delete ' + req.body._id });
            }
          });
        } else {
          res.send('invalid _id');
        }
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
