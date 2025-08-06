const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(`./files/`, (err, files) => {
    res.render("index", { files: files });
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(`./files/${req.body.title}`, req.body.details, (err) => {
    res.redirect("/");
  });
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
    res.render("show", { filename: req.params.filename, filedata: filedata });
  });
});

app.get("/edit/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
    res.render("edit", { filename: req.params.filename, filedata: filedata });
  });
});

app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, (err) => {
    res.redirect("/");
  });
});

app.post("/update/:filename", (req, res) => {
  fs.rename(
    `./files/${req.params.filename}`,
    `./files/${req.body.newTitle}`,
    (err) => {
      fs.writeFile(
        `./files/${req.body.newTitle}`,
        req.body.newDetails,
        (err) => {
          res.render("show", {
            filename: req.body.newTitle,
            filedata: req.body.newDetails,
          });
        }
      );
    }
  );
});

app.listen(3000, (err) => {
  if (!err) {
    console.log("http://localhost:3000");
  }
});
