expressive-router
=================

Alternate router for express. Matches request and handler based on request headers, params, and content negotiation

```
app.get("/?x=something&y=", "Content-Type: text/plain", "produces=html", function(req, res){
    var params = req.params
    params.x // "something"
    params.hasOwnProperty("y") // true
    req.header["Content-Type"] // text/plain, text/*, */*
    req.header["Accepts"] //application/json
    
    res.json("<h1>Say: Hello World!</h1>");
})
```


```
app.get("/?x=something&y=", "Content-Type: text/plain", "produces=json", function(req, res){
    var params = req.params
    params.x // "something"
    params.hasOwnProperty("y") // true
    req.header["Content-Type"] // text/plain, text/*, */*
    req.header["Accepts"] //application/json
    
    res.json({"say": "Hello World!"})
})
```