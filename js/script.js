function addUser() {
    let name = document.querySelector(".write-name").value;
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: `${name}`});

    promise.then(enterChat);
    promise.catch(enterChatError);
}

function enterChatError(error) {
    let statusCode = error.response.status;
    console.log(error.response);

    if (statusCode === 400) {
        alert("Erro! Já existe Usuário com esse nome. Por favor, insira um novo nome de Usuário.");
    }
}

function enterChat() {
    let input = document.querySelector(".write-name");
    let button = document.querySelector("button");
    let loading = document.querySelector(".lds-default");
    let loadingText = document.querySelector("h1");

    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    input.classList.add("hide");
    button.classList.add("hide");
    loading.classList.remove("hide");
    loadingText.classList.remove("hide");

    promise.then(getMessages);
    promise.catch(function () {
        alert("Erro! Por favor, entre na sala de novo.")
    });
}

function getMessages(message) {
    let entryPage = document.querySelector(".entry-page");
    let contentChat = document.querySelector(".content");
    let chat = document.querySelector(".chat");

    entryPage.classList.add("hide");
    contentChat.classList.remove("hide");

    console.log(message.data);

    for (let i = 0; i < message.data.length; i++) {

        if (message.data.type === "status") {
            chat.innerHTML += `<li class="status">
            <h2><span>${message.data.time}</span> <strong>${message.data.from}</strong> ${text}</h2>
            </li>`
        }

        if (message.data.type === "message") {
            chat.innerHTML += `<li>
            <h2><span>${message.data.time}</span> <strong>${message.data.from}</strong> ${text}</h2>
            </li>`
        }

        if (message.data.type === "private_message") {
            chat.innerHTML += `<li class="private">
            <h2><span>${message.data.time}</span> <strong>${message.data.from}</strong> to <strong>${message.data.to}</strong> ${text}</h2>
            </li>`
        }  
    }  
}
