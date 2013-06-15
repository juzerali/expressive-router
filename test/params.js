var express = require('express')
  , router = require("../index")
  , request = require('supertest')
  , chai = require("chai")
  , should = chai.should()
  , methods = require("methods")
  
var app = express();
router.extend(app);

describe("Router", function(){
  before(function(){
    methods.forEach(function(method){
      app[method]("/p?foo=bar&baz=quux", function(req, res){
        req.param("foo").should.equal("bar")
        req.param("baz").should.equal("quux")
        res.status(200).end();
      });

      app[method]("/p?foo=bar", function(req, res){
        req.param("foo").should.equal("bar");
        should.not.exist(req.param("baz"))
        res.status(200).end();
      });

      app.get("/p?foo=", function(req, res){
        var foo = req.param("foo");
        foo.should.exist;
        foo.should.not.equal("bar")
        res.status(200).end();
      });

    });
  });

  it('GET /p?foo=bar&baz=quux', function(done){
      request(app)
        .get("/p?foo=bar&baz=quux")
        .expect(200, done);
  });

  it('POST /p?foo=bar&baz=quux', function(done){
      request(app)
        .post("/p?foo=bar&baz=quux")
        .expect(200, done);
  });

  describe('Router param matcher', function(){
    it('GET /p?foo=bar', function(done){
      request(app)
        .get("/p?foo=bar")
        .expect(200, done);
    });

    it('GET /p?foo= any value', function(done){
      request(app)
        .get("/p?foo=something")
        .expect(200, done);
    });
  });
});