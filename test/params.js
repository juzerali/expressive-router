var express = require('express')
  , router = require("../index")
  , request = require('supertest')
  , chai = require("chai")
  , should = chai.should();
  
var app = express();
router.extend(app);

describe("Router", function(){

  it('GET /p?foo=bar&baz=quux', function(done){
      app.get("/p?foo=bar&baz=quux", function(req, res){
        req.param("foo").should.equal("bar")
        req.param("baz").should.equal("quux")
        res.status(200).end();
      });

      request(app)
        .get("/p?foo=bar&baz=quux")
        .expect(200, done);
    });

  describe('Router param matcher', function(){
    it('GET /p?foo=bar', function(done){
      app.get("/p?foo=bar", function(req, res){
        req.param("foo").should.equal("bar");
        res.status(200).end();
      });

      request(app)
        .get("/p?foo=bar")
        .expect(200, done);
    });

    it('GET /p?foo= any value', function(done){
      app.get("/p?foo=", function(req, res){
        res.status(200).end();
      });

      request(app)
        .get("/p?foo=something")
        .expect(200, done);
    });

  });
});