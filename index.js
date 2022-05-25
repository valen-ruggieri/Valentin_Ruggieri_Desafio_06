const express = require("express");
const app = express();
const PORT = 8000;
const path = require("path");
const productosRouter = require("./routers.js");
const productos = require("./productos");
const server = app.listen(PORT, () => {
  console.log(`Servidor listo en el puerto ${PORT} ✅`);
});

app.use(express.static(path.join(__dirname + "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "ejs");


app.use("/", productosRouter);

server.on("error", (error) => console.log("Hubo un error " + error));

// socket.io
const ioServer = require("socket.io");
const io = ioServer(server);

app.use(express.static(__dirname + "/public"));

const messages = [];

io.on("connection", (socket) => {
  socket.emit("messages", messages);
  socket.on("newMessage", (message) => {
    messages.push(message);
    io.sockets.emit("messages", messages);
  });
  socket.on("deleteChat",()=>{
    messages.splice(0,messages.length)
    io.sockets.emit("messages", messages);
  })
  socket.on("deleteProducts",()=>{
    productos.splice(0,productos.length)
    io.sockets.emit("products", productos);
  })
});
