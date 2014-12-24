var http = require("http"),
    connect = require("connect"),
		serveStatic = require("serve-static"),
		app = connect();

app.use(serveStatic(__dirname + "/code"));

http.createServer(app).listen(5000);