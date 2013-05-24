var express = require('express')
  , router = require("../index")
  , request = require('supertest')
  , chai = require("chai")
  , should = chai.should();
  
var app = express();
router.extend(app);

describe('Header', function(){
  it("Two headers", function(done){
      app.get("/p", "X-Requested-With: XMLHttpRequest", 
                    "X-Forwarded-For: 0.0.0.0",
                  function(req, res) {

        req.get("x-requested-with").should.equal("XMLHttpRequest")
        req.get("x-forwarded-for").should.equal("0.0.0.0")
        res.status(200).end();
      });

      request(app)
        .get("/p")
        .set('X-Requested-With', 'XMLHttpRequest')
        .set("X-Forwarded-For", "0.0.0.0")
        .expect(200, done);

  });

  it("One header", function(done){
      app.get("/p", "X-Requested-With: XMLHttpRequest", function(req, res) {
        req.get("x-requested-with").should.equal("XMLHttpRequest");
        "0.0.0.0".should.not.equal(req.get("x-forwarded-for"));
        res.status(200).end();
      });
      request(app)
        .get("/p")
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect(200, done);
  });

  it("One header with whitespace", function(done){
      request(app)
        .get("/p")
        .set('X-Requested-With', ' 	XMLHttpRequest')
        .expect(200, done);
  });
});