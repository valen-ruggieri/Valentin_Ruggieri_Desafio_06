//                    Main.js

// Creamos un constante llamada socket que sea igual a io()
const socket = io();

// Creamos un selector de los elemntos del DOM para poder traer los valores del formulario
// que enviamos al utilizar el chat de la pagina
// divMessages corresponderia al elemento donde alojaremos los mensajes
// inputAutor corresponde al campo input de donde sacaremos el autor del mensaje
// inputText corresponde al campo input de donde sacaremos del texto del mensaje
// submit corresponde al boton de enviar de nuestro chat que utilizaremos para añadir un evento

const divMessages = document.querySelector("#messagesBox");
const inputAutor = document.querySelector("#autorEmail");
const inputText = document.querySelector("#message");
const submit = document.querySelector("#submit");
const theme = document.querySelector("#theme");

// Una vez realizado la identificacion de estos campos pasamos a darle funcionalidad
// mediante un addEventListener añadiremos un evento de click a nuestro boton submit
// este evento tendra la funcion de crear un dateNow que obtiene los valores de la hora, minutos y segundos
// de cuando se realizo y crearemos el mensaje que es un objeto el cual tiene como props los valores
// de inputAutor, inputText y dateNow.

// Luego de todo esto tendremos un mensaje creado con todos estos datos.

// A continuacion vamos a relizar un socket.emit para emitir el mensaje creado al servidor.



///////////////////////////////////////////////////////////////////
const validationAutor = document.getElementById("validationAutor");
const validationMessage = document.getElementById("validationMessage");

function validationStyle(style) {
  if (style.value == "white") {
    return "form-control btn  text-dark bg-light bg-opacity-25";
  } else {
    return "form-control btn bg-secondary text-white bg-opacity-10";
  }
}

inputAutor.addEventListener("keydown", () => {
  if (inputAutor.value.length >= 6) {
    inputAutor.setAttribute(
      "class",
      `border border-success border-2 ${validationStyle(theme)}`
    );
    validationAutor.textContent = "✅";

    if (inputText.value.length >= 4) {
      submit.removeAttribute("disabled");
    }
  } else if (inputAutor.value.length < 6 && inputAutor.value.length > 0) {
    inputAutor.setAttribute(
      "class",
      `border border-danger border-2 ${validationStyle(theme)}`
    );
    validationAutor.textContent = "❌";
    submit.setAttribute("disabled", "");
  } else {
    inputAutor.setAttribute("class", `${validationStyle(theme)}`);
    validationAutor.textContent = " ";
    submit.setAttribute("disabled", "");
  }
});

inputText.addEventListener("keydown", () => {
  if (inputText.value.length >= 4) {
    inputText.setAttribute(
      "class",
      `border border-success border-2 ${validationStyle(theme)}`
    );
    validationMessage.innerHTML = "✅";
    if (inputAutor.value.length >= 6) {
      submit.removeAttribute("disabled");
    }
  } else if (inputText.value.length < 4 && inputText.value.length > 0) {
    inputText.setAttribute(
      "class",
      `border border-danger border-2 ${validationStyle(theme)}`
    );
    validationMessage.textContent = "❌";
    submit.setAttribute("disabled", "");
  } else {
    inputText.setAttribute("class", `${validationStyle(theme)}`);
    validationMessage.textContent = " ";
    submit.setAttribute("disabled", "");
  }
});

submit.addEventListener("click", (event) => {
  event.preventDefault();
  if (inputAutor.value.length >= 6 && inputText.value.length >= 4) {
    inputText.setAttribute("class", `${validationStyle(theme)}`);
    inputAutor.setAttribute("class", `${validationStyle(theme)}`);
    validationMessage.textContent = " ";
    validationAutor.textContent = " ";

    const date = new Date();
    const dateNow = ` ${date.getHours()}: ${date.getMinutes()}: ${date.getSeconds()}`;
    const message = {
      autor: inputAutor.value,
      date: dateNow,
      text: inputText.value,
    };
    socket.emit("newMessage", message);
    inputAutor.value = "";
    inputText.value = "";
    submit.setAttribute("disabled", "");
  }
});


/////////////////////////////////////////////////////////////////////////////////////////////

// Para pder eliminar nuestros chats vamos a utilizar un boton ya creado en nuestro DOM
// deleteChatButton es un boton que esta dentro del DOM solo que posee un display: none por el momento

const deleteChatButton = document.querySelector("#deleteChat");

// Realizamos un socket.on para escuchar al servidor y obtener el array 'messages'.
// Luego de ello colocamos un condicional que nos evalue este array.
// Dpenediendo de su resultado nos va a ejecutar una accion u otra:

// 1- Si hay mensajes se le agrega a deleteChatButton la clase dispuesta alli, lo que haria que podamos verlo
// dentro de nuestro DOM e interactuar con el.
// Tambien se realiza un socket.emit para emitir los cambios y actualizar del servidor.

// 2- Si NO HAY mensajes se le agrega la clase anterior display: none para que no muestre el boton
// ya que no tendria sentido mostrarlo si no hay elemntos a eiminar.
// Tambien se realiza un socket.emit para emitir los cambios y actualizar del servidor.

socket.on("messages", (messages) => {
  if (messages.length > 0) {
    deleteChatButton.setAttribute(
      "class",
      "w-25 text-decoration-none badge bg-danger"
    );
    divMessages.setAttribute(
      "class",
      "bg-opacity-10 bg-secondary text-start mb-3 pt-3 w-75 ms-2 "
    );
    socket.emit("messages", messages);
  } else if (messages.length == 0) {
    deleteChatButton.setAttribute("class", "d-none");
    divMessages.setAttribute("class", "d-none");
    socket.emit("messages", messages);
  }
});

// Para poder realizar la accion de eliminar el chat realizamos un evento que al presionar el boton
// realice un socket.emit con la palbra reservada 'deleteChat' el cual realizara un splice del array
// que eliminara todos los elementos del mismo cuando del lado del servidor sea ecuchado.

deleteChatButton.addEventListener("click", () => {
  socket.emit("deleteChat");
});

// Para poder agregar un tema a nuestros chats vamos a utilizar la siguiente fraccion de codigo
// ya que en este caso no dependemos de una plantilla para el mensaje como tal por lo que realizaremos lo siguiente:
// 1- Primero que nada seleccionar un valor 'theme' que obtenemos de nuestro changeButton al relizar el cambio de modo.
// 2- Relizar un socket.on para poder traer el array 'messages'  de nuestro servidor.
// 3- Crear un condicional que evalue el valor de theme y de acuerdo a este va a cambiar los estilos del mensaje
// 4- Seleccionar en ambas partes el divMessages que es donde contenermos nuestro elemnto DOM que va a mostar
// el array de mensajes, y alli relizar un innerHTML el cual cambia su contenido.
// 5- El contenido del mismo va a ser un mapeo de todo el array messages generando un mensaje el en DOM con todos sus
// atributos por cada elemento que contenga dicho array.
// 6- Se le agrega el join('') para pasarlo a formato texto.

// De esta manera va a suceder los mismo en ambos casos, con a unica diferencia de que deendiendo del valor de theme
// va a cambiar los estilos del mensaje en cuestion.

socket.on("messages", (messages) => {
  if (theme.value == "white") {
    divMessages.innerHTML = messages
      .map((message) => {
        return `<div><p class="badge bg-secondary text-dark   bg-opacity-10   rounded-pill fs-6 " > 
                    <small class="text-primary  fs-6 ms-3">${message.autor} : </small>
                    <small class="text-dark text-opacity-50 ms-1 fs-6">${message.text}</small> 
                    <small class=" text-light badge bg-opacity-10 bg-gradient  rounded-pill bg-dark ms-4 ">${message.date}</small> 
                    </p>
              </div>`;
      })
      .join("");
  } else if (theme.value == "black") {
    divMessages.innerHTML = messages
      .map((message) => {
        return `<div><p class="badge bg-dark bg-opacity-50  rounded-pill fs-6 " > 
                      <small class="text-danger  fs-6 ms-3">${message.autor} : 
                      <small class="text-light text-opacity-25 ms-1 fs-6">${message.text}</small>
                      <small class="badge bg-light text-dark bg-gradient bg-opacity-10 rounded-pill ms-4 ">${message.date}</small> 
                      </small> 
                      </p>
                </div>`;
      })
      .join("");
  }
});

// Para poder eliminar los productos conntaremos con dos partes:

// 1- Por u lado crear la constante  deleteProducts que nos permite luego
// a este boton poder añadirle un evento de click el cual derive en la funcion de
// emitir mediante socket la la palabra reservada 'deleteProducts'.
// Esta misma va a ser escuhcada del lado del servidor y por lo tanto realizara un splice dl array 'productos'
// dejando asi el mismo vacio.

// 2- Para poder realiza resta accion tomando en cuenta que productos.js esta del lado del servidor y deber actualizarse
// generamos una peticion POST mediante el accionamiento del boton, como se puede apreciar en deleteButton.ejs
// y dentro de la ruta un redireccioamiento hacia la misma, de esta forma actualizando a ruta y reflejando los cambios realizados.

// A modo experimental se podria decir que realizamos una funcion que utiliza Websockets y HTTP

const deleteProducts = document.querySelector("#deleteProducts");

deleteProducts.addEventListener("click", (event) => {
  socket.emit("deleteProducts");
});
