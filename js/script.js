//Global variables definition
let name;

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
      chat.innerHTML += `<li>
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
  const chat = document.querySelector(".chat");

  for (let i = 0; i < messageObject.data.length; i++) {
    let message = messageObject.data[i];

    if (message.type === "status") {
        chat.innerHTML += `<li class="status">
              <h2><span>${message.time}</span>&nbsp; <strong>${message.from}</strong>&nbsp; ${message.text}</h2>
              </li>`;
      }
  
      if (message.type === "message") {
        chat.innerHTML += `<li>
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
    setInterval(getMessages, 3000);
    setInterval(userPresent, 5000);
}

function userPresent() {
    let promise = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/status", 
        {
            name: `${name}`
          });
}

function showUsers() {
    console.log("Cliquei!");
    const backgroundChat = document.querySelector(".content");
    const usersBoard = document.querySelector(".users-board");

    backgroundChat.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    usersBoard.classList.remove("hide");

}