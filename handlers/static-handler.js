const fs = require("fs");
const url = require("url");
const getContentType = require('./getContentType');

module.exports = (req, res) => {
  const pathname = url.parse(req.url).pathname;

  if (pathname.startsWith("/content") && req.method === "GET") {
    if (
      pathname.endsWith("png") ||
      pathname.endsWith("jpg") ||
      pathname.endsWith("jpeg") ||
      pathname.endsWith("ico")
    ) {
      fs.readFile(`./${pathname}`, (err, data) => {
        if (err) {
          res.writeHead(404, {
            "Content-Type": "text/plain",
          });
          res.write("404 Not Found !");
        res.end();
        return;
        }

        res.writeHead(200, {
            "Content-Type": getContentType(pathname),
          });
          res.write(data);
          res.end();
      });
    }else {
        fs.readFile(`./${pathname}`,'utf-8',(err,data) => {
            if(err){
                res.writeHead(404,{
                    "Content-Type": "text/plain"
                });
                res.write("404 Not Found !");
                res.end();
                return;
            }
            res.writeHead(200,{
                "Content-Type": getContentType(pathname)
            });

            res.write(data);
            res.end();
        });
    }
  }else {
    return true;
  }
};
