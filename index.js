
//                       INDEX

// 1 - Como primer paso debemos importar todo lo necesario para nuestro servidor

// 2 - En este caso sera Express,ProductosRouter, Productos y Path.

// 3 - Luego decaramos app y PORT.

// 4 - Creamos una constante deonde se ejecutar la escucha de nuestro servidor junto con un mensaje
//     que nos avise cuando esta listo y en que puerto.
const express = require("express");
const app = express();
const PORT = 8000;
const path = require("path");
const productosRouter = require("./routers.js");
const productos = require("./productos");
const server = app.listen(PORT, () => {
  console.log(`Servidor listo en el puerto ${PORT} ✅`);
});


// 5 - Agregamos todos los middlewares: uno que muestre nuestros archivos estaticos, otro que nos permita 
//     analizar solicitudes JSON y por ultimo el metodo urlEncoded para reconocer el objeto de solictud entrante.

// 6 - Luego agregamos app.set para establecer la configuracion de nuestro motor de plantillas como tambien 
//     la ubicacion de nuestras views.
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "ejs");


// 7 - Creamos un middleware que cumpla la funcion de conectar nuestras rutas co el router importado 
//     desde routers.js
app.use("/", productosRouter);


// 8 - Creamos un metodo .on para escuchar al servidor y que en caso de un error nos lo muestre por consola
server.on("error", (error) => console.log("Hubo un error " + error));


//                                              socket.io

// Para poder crear nuestro servidor Websocket realizamos lo siguiente:

// Importamos socket.io y lo asignamos a una constante llamada ioServer
const ioServer = require("socket.io");

// Creamos otra constante en la cual tomamos como valor el servidor anteriormente creado ioServer solo que esta 
// vez recibiendo todas las propiedades de nuestro server http creado con express.
const io = ioServer(server);

// Creamos un middleware para poder mostrar los archivos estaticos de nuestra carpeta public
app.use(express.static(__dirname + "/public"));

// Creamos un array vacio llamado messages en donde a futuro se enconntraran todos los mensajes del chat
const messages = [];

// Inicializamos el servidor websocket mediante un io.on con la palabra reservada 'connection' y que luego ejecuta como funcion
// socket.emit el cual emite al cliente (situado en main.js) el el array junto con la palbra reservada messages.
// Luego de ello vulve a escuchar al cliente mediante un socket.on solo que esta vz con la palabra reservada 'newMessage'
// lo que da a entende que el cliente esta enviando un mensaje, por lo tanto ejecutamos la funcion donde mediante un push
// al array messages vamos a añadir el message enviado por el cliente a dicho array.

io.on("connection", (socket) => {
  socket.emit("messages", messages);
  socket.on("newMessage", (message) => {
    messages.push(message);
    io.sockets.emit("messages", messages);
  });

// Para poder realizar la accion de eliminar el chat escuchamos mediante socket.on y la palabra reservada 'deleteChat'.
// Luego realizamos la funcion de eliminar todos los elementos del array messages mediante un splice.
// Por ultimo vamos a realizar un io.sockets.emit para poder actualizar el array messages en todos los clientes.
 
  socket.on("deleteChat",()=>{
    messages.splice(0,messages.length)
    io.sockets.emit("messages", messages);
  })

// Para poder realizar la accion de eliminarlos productos escuchamos mediante socket.on y la palabra reservada 'deleteProducts'.
// Luego realizamos la funcion de eliminar todos los elementos del array products mediante un splice.
// Por ultimo vamos a realizar un io.sockets.emit para poder actualizar el array products en todos los clientes.
// Cabe aclarar que si bien se realiza esta funcion, por otro lado estamos generando una peticion para que estos 
// cambios realizado dentro del array productos queden actualizados y reflejados dentro del DOM.
   
  socket.on("deleteProducts",()=>{
    productos.splice(0,productos.length)
    io.sockets.emit("products", productos);
  })
});
