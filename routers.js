const express = require("express");
const router = express.Router();
const productos = require("./productos");
const messages =require('./index')
const imgRandom = require("./imgRandom");
const multer = require("multer");
const path = require("path");
const { join } = require("path");

let web = [];

router.use(express.static(__dirname + '/public/images'));

const storageContent = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "/public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

router.use(
  multer({
    storage: storageContent,
    dest: path.join(__dirname + "/public/images"),
    limits: { fileSize: 1000000 },
  }).single("image")
);

router.post("/", (req, res) => {
  const theme = req.body.theme;
  web.splice(0, 1, theme);

  res.redirect("/form");
});



router.get("/form", (req, res) => {
  res.render("form.ejs", { productos, imgRandom: imgRandom(), theme: web[0]});
});
router.get("/", (req, res) => {
  
  res.render("home.ejs", { productos, imgRandom: imgRandom(), theme: web[0] });
});

router.post("/form", (req, res) => {
  const producto = req.body;
  const file = req.file;
  producto.image = file ? file.filename : false;
  productos.push(producto);
  
  
  res.redirect("/form");
});
router.post("/change", (req, res) => {
  
  const theme = req.body.theme;
  web.splice(0, 1, theme);
  res.redirect("/form");
});
router.post("/delete", (req, res) => {
  res.redirect("/form");
});

module.exports = router;
