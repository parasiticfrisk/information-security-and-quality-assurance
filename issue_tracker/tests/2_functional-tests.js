/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('POST /api/issues/{project} => object with issue data', function() {
    test('Every field filled in', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res) {
          if (err) throw err;
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          done();
        });
    });

    test('Required fields filled in', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Required Title',
          issue_text: 'Required text',
          created_by: 'Functional Test - Required fields filled in'
        })
        .end((err, res) => {
          if (err) throw err;
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Required Title');
          assert.equal(res.body.issue_text, 'Required text');
          assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
          done();
        });
    });

    test('Missing required fields', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: 'Bungus',
          status_text: 'No required Fields'
        })
        .end((err, res) => {
          if (err) throw err;
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Title, text, and created by fields are required');
          done();
        });
    });
  });

  suite('PUT /api/issues/{project} => text', function() {
    test('No body', function(done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: '5cde1b6ed8954f0cddd442db'
        })
        .end((err, res) => {
          if (err) throw err;
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no updated field sent');
          done();
        });
    });

    test('One field to update', function(done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: '5cde1b6ed8954f0cddd442db',
          issue_text: 'Updated this field at ' + new Date().toISOString()
        })
        .end((err, res) => {
          if (err) throw err;
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Update successful!');
          done();
        });
    });

    test('Multiple fields to update', function(done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: '5cde1b6ed8954f0cddd442db',
          issue_title: 'Random title num ' + Math.random(),
          issue_text: 'Random text num ' + Math.random(),
          created_by: 'Random user ' + Math.random(),
          assigned_to: 'Random assign ' + Math.random(),
          status_text: 'Random status ' + Math.random()
        })
        .end((err, res) => {
          if (err) throw err;
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Update successful!');
          done();
        });
    });
  });

  suite('GET /api/issues/{project} => Array of objects with issue data', function() {
    test('No filter', function(done) {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .query({})
        .end(function(err, res) {
          if (err) throw err;
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
    });

    test('One filter', function(done) {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .query({ issue_title: 'another one' })
        .end(function(err, res) {
          if (err) throw err;
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
    });

    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .query({
          created_by: 'br3ntor',
          open: true
        })
        .end((err, res) => {
          if (err) throw err;
          assert.equal(res.status, 200);
          assert.equal(res.body[0].created_by, 'br3ntor');
          assert.equal(res.body[0].open, true);
          done();
        });
    });
  });

  suite('DELETE /api/issues/{project} => text', function() {
    test('No _id', function(done) {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .end((err, res) => {
          if (err) throw err;
          assert.equal(res.status, 200);
          assert.equal(res.text, '_id error');
          done();
        });
    });

    test('Valid _id', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'To Delete',
          issue_text: 'Deleted text',
          created_by: 'Delete testman'
        })
        .end((err, res) => {
          if (err) throw err;

          assert.equal(res.status, 200);          

          chai
            .request(server)
            .delete('/api/issues/test')
            .send({ _id: res.body._id })
            .end((err, deleteResult) => {
              if (err) throw err;

              assert.equal(deleteResult.status, 200);
              assert.equal(deleteResult.body.success, 'deleted ' + res.body._id);
              done();
            });
        });
    });
  });
});
