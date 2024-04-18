var button = document.getElementById("btn-send");
var buttonFile = document.getElementById("btn-file");
var buttonName = document.getElementById("btn-rename");

var input = document.getElementById("input-text");
var inputFile = document.getElementById("input-file");
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
    var isImage = isImageFile(message.Data); // Verifica se é uma imagem

    if (isImage) {
      adicionarImagem(message.Name, message.Data, "19:39");
    } else {
      adicionarDocumento(message.Name, message.Data, "19:39");
    }
  } else if (message.Type == "info") {
    //var texto = (parseInt(message.Data)*10).toString()
    //atualizarPbar(message.Data + "%");
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


function isImageFile(url) {
  // Verifica se a URL termina com uma extensão de imagem comum
  return /\.(jpeg|jpg|gif|png)$/i.test(url);
}

// --

function iniciarConexão() {
  // const socket = new WebSocket("ws://localhost:5200/ws");
  const socket = new WebSocket("wss://7628-186-229-191-15.ngrok-free.app/ws");

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

inputFile.addEventListener("change", (e) => {
  let filex = e.target.files[0];
  console.log(filex);
  // pbar.style.width = "0%";

  var files = e.target.files;

  for (var i = 0; i < files.length; i++) {
    var filey = files[i];
    console.log("Nome do arquivo:", filey.name);
    console.log("Tamanho do arquivo:", filey.size);
    console.log("Tipo do arquivo:", filey.type);
  }

  const file = inputFile.files[0];
  if (file) {
    enviarArquivo(file);
    console.log("descomentar o envio de arquivo");
  } else {
    console.log("Nenhum arquivo selecionado.");
  }
});

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

function desabilitarCampos() {
  document.getElementById("name").style.display = "none";
}

document
  .getElementById("custom-file-button")
  .addEventListener("click", function () {
    document.getElementById("input-file").click();
  });

function adicionarImagem(nome, url, hora) {
  if (nome == lastName) {
    lastMessageRow.removeChild(lastTime);

    var messageRow = document.createElement("div");
    var messageImage = document.createElement("img");
    var messageTime = document.createElement("div");

    messageRow.classList.add("message-row");
    messageImage.classList.add("image-preview");
    messageTime.classList.add("time");

    messageImage.src = url;
    messageTime.textContent = hora;
    messageRow.appendChild(messageImage);
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
    var messageImage = document.createElement("img");

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
    messageImage.classList.add("image-preview");
    messageTime.classList.add("time");

    messageTime.textContent = hora;
    messageImage.src = url;
    messageName.textContent = nome;

    messageRow2.appendChild(messageName);
    messageRow3.appendChild(messageImage);
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


// --

function adicionarDocumento(nome, url, hora) {
  if (nome == lastName) {
    lastMessageRow.removeChild(lastTime);

    var messageRow = document.createElement("div");
    var messageDocument = document.createElement("a");
    var messageTime = document.createElement("div");

    messageRow.classList.add("message-row");
    messageDocument.classList.add("texto");
    messageTime.classList.add("time");

    messageDocument.textContent = "document";
    messageDocument.href = url;
    messageTime.textContent = hora;
    messageRow.appendChild(messageDocument);
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
    // var messageTexto = document.createElement("div");
    var messageDocument = document.createElement("a");

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
    messageDocument.classList.add("texto");
    messageTime.classList.add("time");

    messageTime.textContent = hora;
    messageDocument.textContent = "document";
    messageDocument.href = url;
    messageName.textContent = nome;

    messageRow2.appendChild(messageName);
    messageRow3.appendChild(messageDocument);
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