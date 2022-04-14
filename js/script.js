let name;

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
  console.log(error.response);

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
  promise.catch(function () {
    alert("Erro! Por favor, entre na sala de novo.");
  });
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
            <h2><span>${message.time}</span> <strong>${message.from}</strong> ${message.text}</h2>
            </li>`;
    }

    if (message.type === "message") {
      chat.innerHTML += `<li>
            <h2><span>${message.time}</span> <strong>${message.from}</strong> ${message.text}</h2>
            </li>`;
    }

    if (message.type === "private_message") {
      chat.innerHTML += `<li class="private">
            <h2><span>${message.time}</span> <strong>${message.from}</strong> to <strong>${message.to}</strong> ${message.text}</h2>
            </li>`;
    }
  }

  scrollLastMessage();
}

function updateMessages(messageObject) {
  const chat = document.querySelector(".chat");

  for (let i = 0; i < messageObject.data.length; i++) {
    let message = messageObject.data[i];

    if (message.type === "status") {
      chat.innerHTML += `<li class="status">
            <h2><span>${message.time}</span> <strong>${message.from}</strong> ${message.text}</h2>
            </li>`;
    }

    if (message.type === "message") {
      chat.innerHTML += `<li>
            <h2><span>${message.time}</span> <strong>${message.from}</strong> ${message.text}</h2>
            </li>`;
    }

    if (message.type === "private_message") {
      chat.innerHTML += `<li class="private">
            <h2><span>${message.time}</span> <strong>${message.from}</strong> to <strong>${message.to}</strong> ${message.text}</h2>
            </li>`;
    }
  }

  scrollLastMessage();
}

function sendMessage() {
  let text = document.querySelector(".write-message").value;

  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    {
      from: `${name}`,
      to: "Todos",
      text: `${text}`,
      type: "message",
    }
  );

  promise.then(getMessages);
  promise.catch(errorReload);
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
}
