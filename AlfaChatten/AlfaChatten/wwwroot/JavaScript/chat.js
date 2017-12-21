var transport = signalR.TransportType.WebSockets;
var connection = new signalR.HubConnection(`http://${document.location.host}/chat`, { transport: transport });

var messageInput = document.getElementById('message');
var name = "balle";
//var name = prompt('Enter your name:', '');
var button = document.getElementById("sendMessage");

connection.on('broadcastMessage', (name, message) => {
    var liElement = document.createElement('li');
    liElement.innerHTML = '<strong>' + name + '</strong>:&nbsp;&nbsp;' + message;
    document.getElementById('discussion').appendChild(liElement);
});


button.addEventListener("click", event => {
    connection.invoke('send', name, messageInput.value);
    messageInput.value = '';
    messageInput.focus();
});
connection.start();