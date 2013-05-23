var express = require('express')
  , router = require("../index")
  , request = require('supertest')
  , assert = require('assert')
  , methods = require('methods');
  
describe("Router", function(){
  describe('Router header matcher', function(){
    it("should match header value", function(done){
        var app = express();
        router.extend(app);

        app.get("/", "Accept: application/json", function(req, res){
            res.status(200).end();
        });
        
        request(app)
            .get("/")
            .set('Accept', 'application/json')
            .expect(200, done);
    });
  });

    describe('Router param matcher', function(){
      it('should match parameters', function(done){
        var app = express();
        router.extend(app);

        app.get("/?x=a&z=c", function(req, res){debugger
            assert(req.param("x") === "a")
            assert(req.param("z") === "c")
            res.status(200).end();
        });
        
        request(app)
            .get("/?x=a&y=b&z=c")
            .expect(200, done);
      });  
    });  
});