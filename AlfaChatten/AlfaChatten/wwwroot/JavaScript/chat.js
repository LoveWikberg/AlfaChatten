$(function () {
    $('#chatForm').submit(function (event) {
        event.preventDefault();
        var message = $('#messageInput').val();
        //printOwnMessage(message);
        connection.invoke('send', message);
        $('#messageInput').val("");
    });

    $("#messageInput").keyup(function (e) {
        var key = e.which;
        if (key === 13) {
            $("#chatFormSubmitBtn").click();
        }
    });

    var touchtime = 0;
    $(document).on("click", ".chatBubble", function (e) {
        e.preventDefault();
        if (touchtime === 0) {
            touchtime = new Date().getTime();
        } else {
            if (((new Date().getTime()) - touchtime) < 800) {
                var id = $(this).attr("id");
                removeMessage(id);
            } else {
                touchtime = new Date().getTime();
            }
        }
    });

});

var transport = signalR.TransportType.WebSockets;
var connection = new signalR.HubConnection(`http://${document.location.host}/chat`, { transport: transport });

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

connection.on();

connection.start();

function removeMessage(id) {
    $.ajax({
        url: "api/messages",
        method: "DELETE",
        data: { id: id }
    })
        .done(function () {
            $('.chatBubble#' + id + '').fadeOut(300, function () {
                $(this).remove();
            });
        })
        .fail(function (xhr, status, error) {
            alert("fail");
        });
}

function getAllMessages(userName) {
    $.ajax({
        url: "api/messages/allmessages",
        method: "GET"
    })
        .done(function (result) {
            console.log(result);
            result.forEach(function (chat) {
                checkMessageOrigin(chat, userName);
            });
            $(".chatContent").animate({ scrollTop: $(".chatContent")[0].scrollHeight });
        })
        .fail(function (xhr, status, error) {
            console.log(xhr, status, error);
        })
        .always(function () {
            $('#chatLoader').remove();
        });
}

function checkMessageOrigin(chat, userName) {

    if (chat.user === userName) {
        printMessage(chat, true);
    }
    else {
        printMessage(chat, false);
    }

}

function printMessage(chat, isOwnMessage) {
    var html = "";
    if (isOwnMessage) {
        html += '<div ><p id="' + chat.id + '" class="chatBubble blue">' + chat.message + '<b> - you</b></p>';
    }
    else {
        html += '<div ><p id="' + chat.id + '" class="chatBubble gray">' + chat.message + '<b> - ' + chat.user + '</b></p>';
    }
    html += '</div>';
    $('.chatContent').append(html);
}

function temporaryPrintOwnMessage(message) {
    var html = '<div class="chatBubble blue"><p>' + message + '<b> - you</b></p>';
    html += '</div>';
    $('.chatContent').append(html);
    $(".chatContent").animate({ scrollTop: $(".chatContent")[0].scrollHeight });
}
