var correctSpeltWord = $("#correctSpeltWord");
var wordArray = [];

var key = "6803cc0563d344a9a21f3fa5c968dac5";
var endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/spellcheck/";
var lastPartURL = "?mode=proof&mkt=en-US&text=";

$('#messageInput').keypress(function (e) {
    if (e.which == 13) {
        var input = $("#messageInput").val();
        bingSpellCheck(input);
    }
});

function bingSpellCheck(query) {
    wordArray = [];
    $.ajax({
        url: endpoint + lastPartURL + query,
        headers: { 'Ocp-Apim-Subscription-Key': key },
        success: function (data) {
            $.each(data.flaggedTokens, function (index, result) {
                wordArray.push(result.suggestions[0].suggestion);
            });
            printCorrectSpeltWord(wordArray);
        }
    });
}

function printCorrectSpeltWord(wordArray) {
    console.log(wordArray);
    correctSpeltWord.empty();
    for (var i = 0; i < wordArray.length; i++) {
        correctSpeltWord.append($("<li>").text(wordArray[i]));
    }
}