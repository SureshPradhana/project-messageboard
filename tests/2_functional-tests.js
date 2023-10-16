const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let boardName = 'functional_tests';
  let threadId; // store the thread ID for later tests
  let replyId; // store the reply ID for later tests
  let deletePassword = 'delete_me';

  // Create a new thread
  test('Creating a new thread', function(done) {
    chai
      .request(server)
      .post(`/api/threads/${boardName}`)
      .send({
        text: 'test_thread',
        delete_password: deletePassword,
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, 'test_thread');
        assert.equal(res.body.reported, false);
        assert.isArray(res.body.replies);
        assert.equal(res.body.replies.length, 0);
        assert.isAtLeast(res.body.created_on.length, 5);
        assert.isAtLeast(res.body.bumped_on.length, 5);
        threadId = res.body._id;
        done();
      });
  });

  // Get the 10 most recent threads with 3 replies each
  test('Viewing the 10 most recent threads with 3 replies each', function(done) {
    chai
      .request(server)
      .get(`/api/threads/${boardName}`)
      .end(function(err, res) {   
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isAtMost(res.body.length, 10);
        res.body.forEach((thread) => {
          assert.property(thread, '_id');
          assert.property(thread, 'text');
          assert.property(thread, 'created_on');
          assert.property(thread, 'bumped_on');
          assert.property(thread, 'replies');       
          thread.replies.forEach((reply) => {
            assert.property(reply, '_id');
            assert.property(reply, 'text');
            assert.property(reply, 'created_on');            
          })
        })
        done();
      });
  });

  // Delete a thread with an incorrect password
  test('Deleting a thread with the incorrect password', function(done) {
    chai
      .request(server)
      .delete(`/api/threads/${boardName}`)
      .send({
        thread_id: threadId,
        delete_password: 'incorrect_password',
      })
      .end(function(err, res) {
        assert.equal(res.text,'incorrect password')
        assert.equal(res.status, 200);
        done();
      });
  });



  // Report a thread
  test('Reporting a thread', function(done) {
    chai
      .request(server)
      .put(`/api/threads/${boardName}`)
      .send({
        thread_id: threadId,
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text,'reported');
        done();
      });
  });

  // Create a new reply
  test('Creating a new reply', function(done) {
    chai
      .request(server)
      .post(`/api/replies/${boardName}`)
      .send({
        thread_id: threadId, // Use the previously stored thread ID
        text: 'New reply text',
        delete_password: deletePassword,
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'bumped_on');
        replyId = res.body._id;
        done();
      });
  });

  // View a single thread with all replies
  test('Viewing a single thread with all replies', function(done) {
    chai
      .request(server)
      .get(`/api/replies/${boardName}`)
      .query({ thread_id: threadId })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        let thread=res.body
          assert.property(thread, '_id');
          assert.property(thread, 'text');
          assert.property(thread, 'created_on');
          assert.property(thread, 'bumped_on');
          assert.property(thread, 'replies');       
          thread.replies.forEach((reply) => {
            assert.property(reply, '_id');
            assert.property(reply, 'text');
            assert.property(reply, 'created_on');  
            assert.property(reply, 'bumped_on');
          })
        
        done();
      });
  });

  // Delete a reply with an incorrect password
  test('Deleting a reply with the incorrect password', function(done) {
    chai
      .request(server)
      .delete(`/api/replies/${boardName}`)
      .send({
        thread_id: threadId,
        reply_id: replyId,
        delete_password: 'incorrect_password',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text,'incorrect password')
        done();
      });
  });

  // Delete a reply with the correct password
  test('Deleting a reply with the correct password', function(done) {
    chai
      .request(server)
      .delete(`/api/replies/${boardName}`)
      .send({
        thread_id: threadId,
        reply_id: replyId,
        delete_password: deletePassword,
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text,'success');
        done();
      });
  });
  // Reporting a reply
  test('Reporting a reply', function (done) {
    chai
      .request(server)
      .put(`/api/replies/${boardName}`)
      .send({
        thread_id: threadId, 
        reply_id: replyId,   
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text,'reported');
        done();
      });
  });

  // Delete a thread with the correct password
  test('Deleting a thread with the correct password', function(done) {
    chai
      .request(server)
      .delete(`/api/threads/${boardName}`)
      .send({
        thread_id: threadId,
        delete_password: deletePassword,
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text,'success');
        done();
      });
  });
});
