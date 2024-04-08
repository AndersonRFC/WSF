var button = document.getElementById("btn-send");
var buttonFile = document.getElementById("btn-file");
var buttonName = document.getElementById("btn-rename");

var input = document.getElementById("input-text");
// var inputFile = document.getElementById("input-file");
var inputName = document.getElementById("input-name");

var listaMensagens = document.getElementById("lista-mensagens");

var pbar = document.getElementById("pbar");

var lastName;
var lastTime;
var lastMessageRow;
var lastMessageColumn;

console.log("ola!");

console.log("tentando estabelecer conexão...");

button.addEventListener("click", () => {
  enviarTexto(input.value);
});

input.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    enviarTexto(input.value);
  }
});

// buttonFile.addEventListener("click", () => {
//   const file = inputFile.files[0];
//   if (file) {
//     enviarArquivo(file);
//   } else {
//     console.log("Nenhum arquivo selecionado.");
//   }
// });

buttonName.addEventListener("click", () => {
  var name = inputName.value;
  console.log(name);
  enviarNome(name);
  desabilitarCampos();
});

// --

const socket = iniciarConexão();

// --

socket.onmessage = function (event) {
  var message = JSON.parse(event.data);

  console.log("mensagem recebida: " + event.data);

  if (message.Type === "text") {
    // var itemLista = document.createElement("li");
    // itemLista.textContent = message.Name + ": " + message.Data;
    // listaMensagens.appendChild(itemLista);

    adicionarMensagem(message.Name, message.Data, "19:39");
  } else if (message.Type === "file") {
    var quebraLinha3 = document.createElement("br");
    listaMensagens.appendChild(quebraLinha3);

    var linkDownload = document.createElement("a");
    linkDownload.textContent =
      "Baixar arquivo: " + message.Data.split("/")[1] + "  -  ";
    linkDownload.href = message.Data;
    linkDownload.download = message.Name;
    listaMensagens.appendChild(linkDownload);

    var linkVisualizacao = document.createElement("a");
    linkVisualizacao.textContent = "Ver arquivo: " + message.Data.split("/")[1];
    linkVisualizacao.href = message.Data;
    linkVisualizacao.target = "_blank";
    listaMensagens.appendChild(linkVisualizacao);

    var quebraLinha = document.createElement("br");
    listaMensagens.appendChild(quebraLinha);
  } else if (message.Type == "info") {
    //var texto = (parseInt(message.Data)*10).toString()
    atualizarPbar(message.Data + "%");
    //console.log(message.Data + "px");
  } else if (message.Type == "newUser") {
    console.log("novo usuario: " + message.Data);
  } else if (message.Type == "outUser") {
    console.log("usuario " + message.Data + " saiu");
  } else if (message.Type == "listUsers") {
    atualizarListaUsuarios(message.Data);
  }
};

// --

function iniciarConexão() {
    // const socket = new WebSocket("ws://localhost:5200/ws");
    const socket = new WebSocket("wss://ae48-177-148-191-0.ngrok-free.app/ws");

  socket.onopen = (event) => {
    console.log("Conexão estabelecida");
  };

  return socket;
}

function enviarTexto(value) {
  const message = {
    type: "text",
    name: "none",
    data: value,
    size: value.length,
  };

  const mensagemAEnviar = JSON.stringify(message);

  socket.send(mensagemAEnviar);
  console.log("mensagem enviada: ", mensagemAEnviar);
  input.value = "";
}

function enviarNome(nome) {
  const message = {
    type: "rename",
    name: "none",
    data: nome,
    size: nome.length,
  };

  const mensagemAEnviar = JSON.stringify(message);

  socket.send(mensagemAEnviar);
  console.log("Nome enviado: ", mensagemAEnviar);
}

function enviarArquivo(file) {
  const reader = new FileReader();

  const previousMessage = {
    type: "info",
    name: "None",
    data: file.size,
    size: file.size.toString().length,
  };

  const previaAEnviar = JSON.stringify(previousMessage);

  socket.send(previaAEnviar);

  reader.onload = function (event) {
    const data = event.target.result.split(",")[1];

    const message = {
      type: "file",
      name: file.name,
      data: data,
      size: file.size,
    };

    const mensagemAEnviar = JSON.stringify(message);

    socket.send(mensagemAEnviar);

    console.log("Arquivo enviado: ", file.name);
  };

  reader.readAsDataURL(file);
}

/*

*/

// inputFile.addEventListener("change", (e) => {
//   let file = e.target.files[0];
//   console.log(file);
//   pbar.style.width = "0%";
// });

function atualizarPbar(value) {
  // Atualiza a largura do pbar para 30%
  pbar.style.width = value;
}

function atualizarListaUsuarios(listaUsuarios) {
//   var listaHTML = document.getElementById("lista-usuarios");
//   listaHTML.innerHTML = "";

//   console.log("chamou a lista -----------");
//   console.log(listaUsuarios);
//   listaUsuarios.forEach((u) => {
//     var usuario = document.createElement("p");
//     usuario.innerHTML = u.Name;

//     listaHTML.appendChild(usuario);
//   });

  document.querySelector(".profile-name").innerHTML = listaUsuarios.length;
}

// ----------

function adicionarMensagem(nome, texto, hora) {
  if (nome == lastName) {
    lastMessageRow.removeChild(lastTime);

    var messageRow = document.createElement("div");
    var messageTexto = document.createElement("div");
    var messageTime = document.createElement("div");

    messageRow.classList.add("message-row");
    messageTexto.classList.add("texto");
    messageTime.classList.add("time");

    messageTexto.textContent = texto;
    messageTime.textContent = hora;
    messageRow.appendChild(messageTexto);
    messageRow.appendChild(messageTime);

    lastMessageColumn.appendChild(messageRow);

    lastTime = messageTime;
    lastMessageRow = messageRow;

  } else {
    var messageContainer = document.querySelector(".message-container-reverse");

    var messageArea = document.createElement("div");
    var messageGroup = document.createElement("div");
    var messageColumn = document.createElement("div");
    var messageRow = document.createElement("div");
    var messageProfileIcon = document.createElement("div");
    var messageGroup = document.createElement("div");

    var messageColumn2 = document.createElement("div");
    var messageRow2 = document.createElement("div");
    var messageName = document.createElement("div");

    var messageRow3 = document.createElement("div");
    var messageTexto = document.createElement("div");

    var messageTime = document.createElement("div");

    messageArea.classList.add("message-area");
    messageGroup.classList.add("message-group");
    messageColumn.classList.add("message-column");
    messageColumn2.classList.add("message-column");
    messageRow.classList.add("message-row");
    messageRow2.classList.add("message-row");
    messageRow3.classList.add("message-row");
    messageProfileIcon.classList.add("message-profile-icon");
    messageName.classList.add("message-name");
    messageTexto.classList.add("texto");
    messageTime.classList.add("time");

    messageTime.textContent = hora;
    messageTexto.textContent = texto;
    messageName.textContent = nome;

    messageRow2.appendChild(messageName);
    messageRow3.appendChild(messageTexto);
    messageRow3.appendChild(messageTime);

    messageColumn2.appendChild(messageRow2);
    messageColumn2.appendChild(messageRow3);

    // messageRow.appendChild(messageProfileIcon);
    messageColumn.appendChild(messageRow);

    messageGroup.appendChild(messageColumn);
    messageGroup.appendChild(messageColumn2);

    messageArea.appendChild(messageGroup);

    messageContainer.appendChild(messageGroup);


    lastMessageColumn = messageColumn2;
    lastTime = messageTime;
    lastMessageRow = messageRow3;
    lastName = nome;
  }
}

function desabilitarCampos(){
    document.getElementById('name').style.display = 'none';
}