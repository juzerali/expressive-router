
/**
 * Module dependencies.
 */
var utils = require("../utils");

/**
 * Expose `Route`.
 */

module.exports = Route;

/**
 * Initialize `Route` with the given HTTP `method`, `path`,
 * and an array of `callbacks` and `options`.
 *
 * Options:
 *
 *   - `sensitive`    enable case-sensitive routes
 *   - `strict`       enable strict matching for trailing slashes
 *
 * @param {String} method
 * @param {String} path
 * @param {Array} callbacks
 * @param {Object} options.
 * @api private
 */

function Route(method, path, rawrules, callbacks, options) {
  options = options || {};
  var self = this;
  this.path = path.substring(0, path.indexOf("?"));
  this.method = method;
  this.callbacks = callbacks;
  this.rules = {
      headers: {},
      params: {}
  };
  this.regexp = utils.pathRegexp(this.path
    , this.keys = []
    , options.sensitive
    , options.strict);
    var paramRules = path.substring(path.indexOf("?")+1);
    
    if (paramRules != path){
        paramRules = paramRules.split("&");
        paramRules.forEach(function(str, i){
            var tuple = str.split("=");
            self.rules.params[tuple[0]] = tuple[1] || "";
        });
    }
    
    rawrules.forEach(function(str, i){
        var strlc = str.toLowerCase();
        if (strlc.trim().indexOf("produces") === 0){
            self.rules.produces = str.substring(str.indexOf("=") + 1);
        } else if (strlc.trim().indexOf("accepts") === 0){
            self.rules.accepts = str.substring(str.indexOf("=") + 1);
        } else if (~str.indexOf(":") && "\\" != str[str.indexOf(":") - 1]){
            var key = strlc.trim().substring(0, strlc.indexOf(":"));
            var value = str.trim().substring(strlc.indexOf(":") + 1);
            self.rules.headers[key] = value.trim();
        }
    });  
}

/**
 * Check if this route matches `path`, if so
 * populate `.params`.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

Route.prototype.match = function(path, req){
  var keys = this.keys
    , params = this.params = []
    , m = this.regexp.exec(path);

  if (!m) return false;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];

    var val = 'string' == typeof m[i]
      ? decodeURIComponent(m[i])
      : m[i];

    if (key) {
      params[key.name] = val;
    } else {
      params.push(val);
    }
  }
  
  var server_produces = this.rules.produces;
  var reduce;
  if (server_produces){
      var accepts = req.get("accepts");
      if (!(~accepts.indexOf("*/*") || ~accepts.indexOf("text/*"))){
          reduce = server_produces.split(",").reduce(function(prev, cur, i){
              return prev || ~accepts.indexOf(cur);
          }, false);
          if (!reduce) return false;
      }  
  }
  
  var server_accepts = this.rules.accepts;
  if (server_accepts){
      var contentType = req.get("content-type");
      if (!(~contentType.indexOf("*/*") || ~contentType.indexOf("text/*"))){
          reduce = server_accepts.split(",").reduce(function(prev, cur, i){
              return prev || contentType.indexOf(cur);
          }, false);
          if (!reduce) return false;
      }
  }
  debugger
  for (var header in this.rules.headers){
      if (req.get(header) !== this.rules.headers[header])
        return false;
  }
  
  for (var param in this.rules.params){
      if (req.param(param) !== this.rules.params[param])
        return false;
  }
  
  return true;
};