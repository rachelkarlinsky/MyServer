const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
let notices = require("./database.json");
const app = express();
const cors = require('cors');

app.use(cors());
  
const save = () => {
    fs.writeFile(
      "./database.json",
      JSON.stringify(notices, null, 2),
      (error) => {
        if (error) {
          throw error;
        }
      }
    );
  };

app.get("/notices", (req, res) => {
    res.json(notices);
});


app.get("/notices/:notice", (req, res) => {
    const noticeId = parseInt(req.params.notice);
    const findNotice = notices.find((notice) => notice.id === noticeId);
    res.json(findNotice);
});

app.post("/notices", bodyParser.json(), (req, res) => {
  req.body["id"] = notices[notices.length-1].id+1;
  notices.push(req.body);
  save();
  res.json({
    status: "success",
    stateInfo: req.body,
  });
});

app.post("/notices/:notice", bodyParser.json(), (req, res) => {
  const noticeId = parseInt(req.params.notice);
  notices = notices.map((notice) => {
      if (notice.id === noticeId) {
        return req.body;
      } else {
        return notice;
      }
    });
    save();
    res.json({
      status: "success",
      stateInfo: req.body,
    });
});

app.delete("/notices/:notice", (req, res) => {
    const noticeId = parseInt(req.params.notice);
    notices = notices.filter((notice) => notice.id !== noticeId);
    save();
    res.json({
      status: "success",
      removed: req.params.id,
      newLength: notices.length,
    });
});

app.listen(4201, () => {
    console.log(`Server Start at the Port 4201`);
});




