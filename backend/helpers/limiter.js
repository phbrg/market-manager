const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: function(req, res) {
    return req.ip || req.connection.remoteAddress;
  }
});

module.exports = limiter;