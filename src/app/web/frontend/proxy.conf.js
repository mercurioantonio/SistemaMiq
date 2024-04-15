const PROXY_CONFIG = [
  {
    context: ['/'],
    target: 'http://localhost:5000',
    bypass: (req) => (req.headers.accept.includes("html") ? "/" : null),
    secure: false,
    changeOrigin: false,
    logLevel: 'debug'
  }
]

module.exports = PROXY_CONFIG;