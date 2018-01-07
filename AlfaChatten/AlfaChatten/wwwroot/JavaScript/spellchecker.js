$("#btnSpellCheck").click(function () {
    
    var input = $("#messageInput").val();

    bingSpellCheck(input);
    
});



function bingSpellCheck(query) {

    var key = "6803cc0563d344a9a21f3fa5c968dac5";
    var endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/spellcheck/";
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
            getSpellCheckedWord(JSON.parse(this.responseText));
        }
        else {
            alert("Subscription key to old, or used");
        }
    });

    request.send();
    return false;
}


function getSpellCheckedWord(jsonResult) {                                              //Get word from api

    var words = jsonResult.flaggedTokens;
    var wordArray = [];

    $.each(words, function (index, result) {
        wordArray.push(result.suggestions[0].suggestion);
    });

    console.log(wordArray);
}




function getWordAt(word, markerPosition) {                                          //Get word at marker position

    word = String(word);
    markerPosition = Number(markerPosition);

    var left = word.slice(0, markerPosition + 1).search(/\S+$/),
        right = word.slice(markerPosition).search(/\s/);

    if (right < 0) {
        return word.slice(left);
    }

    return word.slice(left, right + markerPosition);
}