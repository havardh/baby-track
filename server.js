const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const dev = process.env.NODE_ENV !== "production";
const port = dev ? 3000 : process.env.PORT;
const app = express();

try {
  const users = require("./.basic-auth");
  var basicAuth = require('express-basic-auth')

  app.use(basicAuth({
    users,
    challenge: true
  }))
  console.log("basic auth");
} catch (e) {
  console.log(e);
  console.log("no auth");
}

app.use("/api", require("./server/index"))

if (dev) {
  const config = require("./webpack.config.js");
  const compiler = webpack(config);

  const middleware = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: "src"
  });



  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.get("*", function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + "/dist"));
  app.get("*", function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}



app.listen(port, 'localhost', function onStart(err) {
  if (err) {
    console.log(err);
  }

  console.info("==> live on port %s", port);
})
