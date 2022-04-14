//Global variables definition
let name;
const usersBoard = document.querySelector(".users-board");
const chat = document.querySelector(".chat");
const ONE_SECOND = 1000;

//Send the message through the Enter key
const inputMessage = document.querySelector(".write-message");
inputMessage.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.querySelector(".footer button").click();
    inputMessage.value = '';
  }
});

//Functions definition
function addUser() {
  name = document.querySelector(".write-name").value;
  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    { name: `${name}` }
  );

  promise.then(enterChat);
  promise.catch(enterChatError);
}

function enterChatError(error) {
  let statusCode = error.response.status;

  if (statusCode === 400) {
    alert(
      "Erro! Já existe Usuário com esse nome. Por favor, insira um novo nome de Usuário."
    );
  }
}

function enterChat() {
  let input = document.querySelector(".write-name");
  let button = document.querySelector("button");
  let loading = document.querySelector(".lds-default");
  let loadingText = document.querySelector("h1");

  let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

  input.classList.add("hide");
  button.classList.add("hide");
  loading.classList.remove("hide");
  loadingText.classList.remove("hide");

  promise.then(showMessages);
  promise.catch(errorReload);
}

function showMessages(messageObject) {
  const entryPage = document.querySelector(".entry-page");
  const contentChat = document.querySelector(".content");
  const chat = document.querySelector(".chat");

  entryPage.classList.add("hide");
  contentChat.classList.remove("hide");

  for (let i = 0; i < messageObject.data.length; i++) {
    let message = messageObject.data[i];

    if (message.type === "status") {
      chat.innerHTML += `<li class="status">
            <h2><span>${message.time}</span>&nbsp; <strong>${message.from}</strong>&nbsp; ${message.text}</h2>
            </li>`;
    }

    if (message.type === "message") {
      chat.innerHTML += `<li class="message">
            <h2><span>${message.time}</span>&nbsp; <strong>${message.from}</strong> para <strong>Todos</strong>: &nbsp;${message.text}</h2>
            </li>`;
    }

    if (message.type === "private_message") {
      chat.innerHTML += `<li class="private">
            <h2><span>${message.time}</span>&nbsp; <strong>${message.from}</strong> to <strong>${message.to}</strong>: &nbsp;${message.text}</h2>
            </li>`;
    }
  }

  scrollLastMessage();
  updatePage();
}

function updateMessages(messageObject) {
  for (let i = 0; i < messageObject.data.length; i++) {
    let message = messageObject.data[i];

    if (message.type === "status") {
        chat.innerHTML += `<li class="status">
              <h2><span>${message.time}</span>&nbsp; <strong>${message.from}</strong>&nbsp; ${message.text}</h2>
              </li>`;
      }
  
      if (message.type === "message") {
        chat.innerHTML += `<li class="message">
              <h2><span>${message.time}</span>&nbsp; <strong>${message.from}</strong> para <strong>Todos</strong>: &nbsp;${message.text}</h2>
              </li>`;
      }
  
      if (message.type === "private_message") {
        chat.innerHTML += `<li class="private">
              <h2><span>${message.time}</span>&nbsp; <strong>${message.from}</strong> to <strong>${message.to}</strong>: &nbsp;${message.text}</h2>
              </li>`;
      }
  }

  scrollLastMessage();
}

function sendMessage() {
  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    {
      from: `${name}`,
      to: "Todos",
      text: `${inputMessage.value}`,
      type: "message",
    }
  );

  promise.then(getMessages);
  promise.catch(errorReload);

  inputMessage.value = '';
}

function getMessages() {
  let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

  promise.then(updateMessages);
  promise.catch(errorReload);
}

function scrollLastMessage() {
  const lastMessage = document.querySelector(".chat").lastElementChild;
  lastMessage.scrollIntoView();
}

function errorReload() {
  alert("Erro! Recarregue a página!");
  window.location.reload();
}

function updatePage() {
    setInterval(getMessages, (3 * ONE_SECOND));
    setInterval(userPresent, (5 * ONE_SECOND));
    setInterval(getUsers, (10 * ONE_SECOND));
}

function userPresent() {
    let promise = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/status", 
        {
            name: `${name}`
          });
}

function showUsers() {
    const header = document.querySelector(".header");
    const footer = document.querySelector(".footer");

    usersBoard.classList.remove("hide");

    header.style.filter = "brightness(60%)";
    chat.style.filter = "brightness(60%)";
    footer.style.filter = "brightness(60%)";
    
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(userList);
    promise.catch(errorReload);
}

function userList(userObject) {
    const list = document.querySelector(".users-list");
    let userSize = userObject.data.length;

    for (let i = 0; i < userSize; i++) {
        let user = userObject.data[i];
        list.innerHTML += `<li><ion-icon name="person-circle"></ion-icon><h4>${user.name}</h4><ion-icon class="hide" name="checkmark-outline"></ion-icon></li>`;
    }
}

function getUsers() {
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(userList);
    promise.catch(errorReload);
}

