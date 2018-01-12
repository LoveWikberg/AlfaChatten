$(function () {

    var touchtime = 0;
    $("#messageInput").on("click", function (e) {
        e.preventDefault();
        if (touchtime === 0) {
            touchtime = new Date().getTime();
        } else {
            if (((new Date().getTime()) - touchtime) < 800) {
                var msg = $(this).val();
                if (msg.length !== 0) {
                    var test = $(this)[0].selectionStart;
                    var word = getWordAt(msg, test);
                    bingSpellCheck(word);
                }
            } else {
                touchtime = new Date().getTime();
            }
        }
    });

});

var key = "6803cc0563d344a9a21f3fa5c968dac5";
var endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/spellcheck/";
var lastPartURL = "?mode=proof&mkt=en-US&text=";

function bingSpellCheck(query) {
    $.ajax({
        url: endpoint + lastPartURL + query,
        headers: { 'Ocp-Apim-Subscription-Key': key },
        success: function (data) {
            if (data.flaggedTokens.length === 0)
                $('#messageInput').addClass('redGlow').one('webkitAnimationEnd...', function () { $(this).removeClass('redGlow'); });
            else {
                $('#messageInput').addClass('greenGlow').one('webkitAnimationEnd...', function () { $(this).removeClass('greenGlow'); });
                var correctWord = data.flaggedTokens[0].suggestions[0].suggestion;
                changeWord(query, correctWord);
            }
        },
        fail: function (xhr, status, error) {
            console.log(xhe, status, error);
        }
    });
}

function changeWord(inCorrectWord, correctWord) {
    var msg = $('#messageInput').val();
    var regex = new RegExp(inCorrectWord, "gi");
    msg = msg.replace(regex, correctWord);
    $('#messageInput').val(msg);
}

function getWordAt(str, pos) {

    str = String(str);
    pos = Number(pos);
    //pos = Number(pos) >>> 0;

    var left = str.slice(0, pos + 1).search(/\S+$/),
        right = str.slice(pos).search(/\s/);

    if (right < 0) {
        return str.slice(left);
    }

    return str.slice(left, right + pos);

}

