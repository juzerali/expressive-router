var express = require('express')
  , request = require('supertest')
  , assert = require('assert')
  , methods = require('methods');
  
describe("Router", function(){
    it("should work", function(done){
        var app = express();
        
        app.get("/?x=y", function(req, res){
            assert(req.params.x === "y");
            res.status(200);
        });
        
        request(app)
            .get("/?x=y")
            .expect(200, done);
    });    
});