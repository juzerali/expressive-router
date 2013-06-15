expressive-router
=================

Alternate router for express. Matches request and handler based on request headers, params, and content negotiation

# Install
```
npm install expressive-router express
```

# Setup

```javascript
var express = require('express')
  , router = require("expressive-router");

var app = express();
router.extend(app);
```

# Match headers
```javascript

    app.get("/p", "X-Forwarded-For: 0.0.0.0", function(req, res){
        req.header(X-Forwarded-For) 
        //=> 0.0.0.0

        //handle request
    })
```

# Match request parameters

```javascript
    
    app.get("/?foo=bar&baz=", function(req, res){
        /*
        * It will reach here only when req parameters 
        * 1. foo equal to "bar"
        * 2. and has baz present
        */
        req.param("foo")
        //=> "bar"

        req.param("baz")
        //=> "Whatever"
    })
```
Same semantics for all methods. In other words, it doesn't matter where the mentioned key is, it could be in

* query
* body

# Content Negotiation
    Example not available

# Caveat
Like express paths, put the most specific or non-greedy path first.
For example put `app.get("/foo=bar&bar=baz"...)` before `app.get("/foo=bar"...)`. If you register them in reverse order, the more specific one will never get called and `app.get("/foo=bar"...)` will serve the request intended for both of 'em.

# Licence
MIT
