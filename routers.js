
//                                ROUTERS

// 1 - Como primer paso debemos importar todo lo necesario para nuestras rutas

// 2 - En este caso sera Express, ImgRandom, Multer,  Productos y Path.

// 3 - Crearemos la constante router donde le daremos como valor la funcion de express para crear rutas.
const express = require("express");
const router = express.Router();
const productos = require("./productos");
const imgRandom = require("./imgRandom");
const multer = require("multer");
const path = require("path");


// 4 - Creamos un array vacio llamado web que es donde mas luego alojaremos un valor el cual determinara el modo 
//     en el que se visualizara nuestra pagina (black/white) ya que este mismo array solo puede contener un valor
//     y dicho valor sera enviado a las plantillas las cuales renderizaran con un conjunto de estilos u otro.
let web = [];


// 5 - Creamos un middleware paa poder mostrar nuestros archivos estaticos alojados en el carpeta public.
router.use(express.static(__dirname + '/public/images'));


// 6 - Creamos una constate storageContent en el cual utilizaremos la propiedad diskStorage de multer para poder
//     crear un storage de nuestras imagenes que vamos a subir mediante el formulario, el objeto debera obtener 
//     la propiedad destination donde se le indica en que parte del directorio podra alojar los archivos.
//     Tambien deberiamos utlizar otra propiedad llaada filename donde mediante esta asignaremos el nombre a nuestros archivos.
const storageContent = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "/public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});


// 7 - Creamos un middleware para poder utilizar multer donde especificaremos cual queremos sea nuetro storage ( en nuestro caso
//     sera el creado anteriormente storageContent ), el destino donde indicaremos donde seran alojados los archivos, el limite
//     de tamaño de los archivos que se permite y por ultimmo el .single que indica que solo enviaremos un archivo por peticion
//     junto con el name atributo del input que envia el archivo que se encuentra en el formulario .single('name atributo').
router.use(
  multer({
    storage: storageContent,
    dest: path.join(__dirname + "/public/images"),
    limits: { fileSize: 1000000 },
  }).single("image")
);


// 8 - Realizamos ua peticion POST para la ruta raiz (HOME) en la cual traeremos el valor del tema seleccionado, borraremos el anterior valor
//     del array web reemplazandolo por el que obtenemos de req.body.theme.
//     Por ultimo redireccionamos a la pagina de la tienda de productos.
router.post("/", (req, res) => {
  const theme = req.body.theme;
  web.splice(0, 1, theme);

  res.redirect("/tienda");
});


// 9 - Realizamos una peticion GET en la ruta /tienda donde medienate res.render rederizaremos nuestras plantillas seleccionando cual de ellas
//     debemos utilizar como asi tambien los parametros que les queremos pasar.
router.get("/tienda", (req, res) => {
  res.render("tienda.ejs", { productos, imgRandom: imgRandom(), theme: web[0]});
});


// 10 - Realizamos una peticion GET en la ruta /  (HOME) donde medienate res.render rederizaremos nuestras plantillas seleccionando cual de ellas
//      debemos utilizar como asi tambien los parametros que les queremos pasar.
router.get("/", (req, res) => {
  
  res.render("home.ejs", { productos, imgRandom: imgRandom(), theme: web[0] });
});


// 11 - Realizamos una peticion POST en la ruta /tienda donde obtendremos los valores del producto eviado por formulario, como asi tambien el valor
//      de la imagen/archivo del producto mediante req.file.

//      Utilizamos un operador ternario para poder modificar el parametro que va a recibir la plantilla a ala hora de renderizar los productos
//      si existe un archivo la propiedad image del producto sera este archivo, en caso contrario sera false .

//      Esto es asi ya que en la plantilla existe un condicional el cual evalua a producto.image y segun eso utiliza la imagen subida localmente 
//      o en caso de no existir tal imagen utiliza un imagen random que devuleve la funcion imgRandom.

//      Luego de ya tener prodcto modificado realiza un push agregado dicho producto junto con sus propiedades dentro del array productos.

//      Por ultimo redireccionamos hacia la misma pagina para poder visualizar los cambios efectuados.
router.post("/tienda", (req, res) => {
  const producto = req.body;
  const file = req.file;
  producto.image = file ? file.filename : false;
  productos.push(producto);
  res.redirect("/tienda");
});



// 12 - Realizamos ua peticion POST para la ruta /change que utiliza changeButton.ejs en la cual traeremos el valor del tema seleccionado, borraremos
//      el anterior valor del array web reemplazandolo por el que obtenemos de req.body.theme.
//      Por ultimo redireccionamos a la pagina de la tienda de productos.
router.post("/change", (req, res) => {
  const theme = req.body.theme;
  web.splice(0, 1, theme);
  res.redirect("/tienda");
});


// 13 - Realizamos ua peticion POST para la ruta /delete que utiliza deleteButton.ejs solo para actualizar ya que
//      las acciones son realizadas por socket.io
router.post("/delete", (req, res) => {
  res.redirect("/tienda");
});


// 14 - Exportamos router para utilizar en el index.js
module.exports = router;
