var key = "6803cc0563d344a9a21f3fa5c968dac5";
var endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/spellcheck/";
var correctSpeltWord = $("#correctSpeltWord");
var wordArray = [];

$('#messageInput').keypress(function (e) {
    if (e.which == 13) {
        var input = $("#messageInput").val();
        bingSpellCheck(input);
    }
});

function bingSpellCheck(query) {
    var request = new XMLHttpRequest();
    try {
        request.open("GET", endpoint + "?mode=proof&mkt=en-US&text=" + encodeURIComponent(query));
    }
    catch (e) {
        renderErrorMessage("Bad request");
        return false;
    }
    request.setRequestHeader("Ocp-Apim-Subscription-Key", key);

    request.addEventListener("load", function () {
        if (this.status === 200) {
            getSpellCheckedWord(JSON.parse(this.responseText));}
        else {
            alert("Subscription key to old, or used too many times.");
        }
    });
    request.send();
    return false;
}

function getSpellCheckedWord(jsonResult) {

    wordArray = [];
    var words = jsonResult.flaggedTokens;
    $.each(words, function (index, result) {
        wordArray.push(result.suggestions[0].suggestion);
    });
    printCorrectSpeltWord(wordArray);
}

function printCorrectSpeltWord(wordArray) {

    console.log(wordArray);
    correctSpeltWord.empty(); 7
    for (var i = 0; i < wordArray.length; i++) {
        correctSpeltWord.append($("<li>").text(wordArray[i]));
    }
}