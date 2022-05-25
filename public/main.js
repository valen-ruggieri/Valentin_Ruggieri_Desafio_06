const socket = io();
const divMessages = document.querySelector("#messagesBox");
const inputAutor = document.querySelector("#autorEmail");
const inputText = document.querySelector("#message");
const submit = document.querySelector("#submit");

submit.addEventListener("click", (event) => {
  event.preventDefault();

  const date = new Date();
  const dateNow = ` ${date.getHours()}: ${date.getMinutes()}: ${date.getSeconds()}`;
  const message = {
    autor: inputAutor.value,
    date: dateNow,
    text: inputText.value,
  };
  socket.emit("newMessage", message);
  inputAutor.value='';
  inputText.value='';
});

const deleteChatButton = document.querySelector('#deleteChat')


socket.on("messages", (messages) => {
  if(messages.length > 0){
    deleteChatButton.setAttribute('class',"w-25 text-decoration-none badge bg-danger")
    divMessages.setAttribute('class',"bg-opacity-10 bg-secondary text-start mb-3 pt-3 w-75 ms-2 ");
    socket.emit("messages", messages);
  }else if(messages.length == 0){
    deleteChatButton.setAttribute('class',"d-none");
    divMessages.setAttribute('class',"d-none");
    socket.emit("messages", messages);
  }})

const theme = document.querySelector("#theme");

socket.on("messages", (messages) => {
  console.log("on en local");
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

const deleteChat = document.querySelector("#deleteChat");

deleteChat.addEventListener("click", () => {
  socket.emit("deleteChat");
});

const deleteProducts = document.querySelector("#deleteProducts");

deleteProducts.addEventListener("click", (event) => {
  socket.emit("deleteProducts");
});
