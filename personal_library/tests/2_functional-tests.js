/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

// The last two tests below use nested requests to get a book id
// I could set a global variable to book id from the first post test

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', function(done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function(err, res) {
        if (err) throw err;
        if (res.body.length === 0) {
          console.log('No books in database');
          done();
        } else {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        }
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function() {
    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .type('form')
          .send({ title: 'Test Book #1' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Response obj should have title');
            assert.property(res.body, '_id', 'Response obj should have _id');
            assert.isArray(res.body.comments, 'comments prop is array');
            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .type('form')
          .send({ title: '' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isUndefined(res.body.title);
            done();
          });
      });
    });

    suite('GET /api/books => array of books', function() {
      test('Test GET /api/books', function(done) {
        chai
          .request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function() {
      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai
          .request(server)
          .get('/api/books/5d5b424b29a368326aae4cdb')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .type('form')
          .send({ title: 'Test book #2' })
          .end((err, res) => {
            chai
              .request(server)
              .get('/api/books/' + res.body._id)
              .end((e, r) => {
                assert.equal(r.status, 200);
                assert.property(r.body, '_id');
                assert.property(r.body, 'title');
                assert.property(r.body, 'comments');
                done();
              });
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function() {
      test('Test POST /api/books/[id] with comment', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .type('form')
          .send({ title: 'Test book #3' })
          .end((err, res) => {
            chai
              .request(server)
              .post('/api/books/' + res.body._id)
              .type('form')
              .send({ comment: 'Test comment here' })
              .end((e, r) => {
                assert.equal(r.status, 200);
                assert.property(r.body, '_id');
                assert.property(r.body, 'title');
                assert.property(r.body, 'comments');
                done();
              });
          }); 
      });
    });
  });
});
