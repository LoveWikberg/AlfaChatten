var transport = signalR.TransportType.WebSockets;
var connection = new signalR.HubConnection(`http://${document.location.host}/chat`, { transport: transport });

var messageInput = document.getElementById('message');
var name = "balle";
//var name = prompt('Enter your name:', '');
var button = document.getElementById("sendMessage");

$('form').submit(function (event) {
    event.preventDefault();
    var message = $('#messageInput').val();
    printOwnMessage(message);
    connection.invoke('send', message);
});

connection.on('broadcastMessage', (name, message) => {
    var html = '<div class="chatBubble gray"><p>' + message + '<b> - ' + name + '</b></p>';
    html += '</div>';
    $('.chatContent').append(html);
    //var liElement = document.createElement('li');
    //liElement.innerHTML = '<strong>' + name + '</strong>:&nbsp;&nbsp;' + message;
    //document.getElementById('discussion').appendChild(liElement);
});


//button.addEventListener("click", event => {
//    connection.invoke('send', name, messageInput.value);
//    messageInput.value = '';
//    messageInput.focus();
//});

connection.start();


function printOwnMessage(msg) {
    var html = '<div class="chatBubble blue"><p>' + msg + '<b> - you</b></p>';
    html += '</div>';
    $('.chatContent').append(html);
}