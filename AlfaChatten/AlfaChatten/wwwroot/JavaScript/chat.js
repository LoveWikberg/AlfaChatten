$(function () {

});

var transport = signalR.TransportType.WebSockets;
var connection = new signalR.HubConnection(`http://${document.location.host}/chat`, { transport: transport });

//var button = document.getElementById("sendMessage");

$('#chatForm').submit(function (event) {
    event.preventDefault();
    var message = $('#messageInput').val();
    //printOwnMessage(message);
    connection.invoke('send', message);
    $('#messageInput').val("");
});

// Följ denna länk för att lägga till en funktion som
// spelar upp ett ljud när ett meddelande tas emot:
// https://stackoverflow.com/questions/8489710/play-an-audio-file-using-jquery-when-a-button-is-clicked
connection.on('broadcastMessage', (name, message) => {
    var html = '<div class="chatBubble gray"><p>' + message + '<b> - ' + name + '</b></p>';
    html += '</div>';
    $('.chatContent').append(html);
    $(".chatContent").animate({ scrollTop: $(".chatContent")[0].scrollHeight }, 100);
    //var liElement = document.createElement('li');
    //liElement.innerHTML = '<strong>' + name + '</strong>:&nbsp;&nbsp;' + message;
    //document.getElementById('discussion').appendChild(liElement);
});

connection.on('broadcastMessageToSelf', (message) => {
    temporaryPrintOwnMessage(message);
});


//button.addEventListener("click", event => {
//    connection.invoke('send', name, messageInput.value);
//    messageInput.value = '';
//    messageInput.focus();
//});

connection.start();

function getAllMessages(userName) {
    $.ajax({
        url: "api/messages/getallmessages",
        method: "GET"
    })
        .done(function (result) {
            console.log(result);
            result.forEach(function (chat) {
                console.log(chat);
                console.log(userName);
                printMessage(chat, userName);
            });
            $(".chatContent").animate({ scrollTop: $(".chatContent")[0].scrollHeight });
        })
        .fail(function (xhr, status, error) {
            console.log(xhr, status, error);
        });
}

function printMessage(chat, userName) {

    if (chat.user === userName) {
        printOwnMessage(chat, true);
    }
    else {
        printOwnMessage(chat, false)
    }

}

function printOwnMessage(chat, isOwnMessage) {
    if (isOwnMessage) {
        var html = '<div class="chatBubble blue" style="float:right;"><p>' + chat.message + '<b> - you</b></p>';
    }
    else {
        var html = '<div class="chatBubble gray"><p>' + chat.message + '<b> - ' + chat.user + '</b></p>';
    }
    html += '</div>';
    $('.chatContent').append(html);
}

function temporaryPrintOwnMessage(message) {
    var html = '<div class="chatBubble blue" style="float:right;"><p>' + message + '<b> - you</b></p>';
    html += '</div>';
    $('.chatContent').append(html);
    $(".chatContent").animate({ scrollTop: $(".chatContent")[0].scrollHeight });
}
