const expect = require('expect');
const request = require('supertest');
const {app} = require('../app');
const seed = require('../seeds');
const User = require('../models/User');


before(seed);

describe('GET /home', () => {
    it('should get to home', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .end(done);
    });
  });
describe('POST /signup', () => {

  it('should create user', (done) => {
    var user = {
      name: "Asi Baka",
      username: "asibaasdaska@science.christuniversity.in",
      password: "asibaka",
    }
    request(app)
      .post('/signup')
      .send(user)
      .expect(302)
      .expect((res) => {
        console.log(res.body.user);
        expect(res.body).toBeTruthy();
        // expect(res.body._id).toExist();
      })
      // .end((err) => {
      //   if(err) return done(err)
      //   User.findByUsername(user.username,true).then((res) => {
      //     expect(res).toBeTruthy();
      //     done();
      //   })
      // })
      .end((err) => {
        if (err) {
          return done(err);
        }
        // done();
        User.findOne({username:user.username},function(err,acc) {
          if(err) return done(err);
          expect(acc).toBeTruthy();
          done();
        })
      });
      

  });
});