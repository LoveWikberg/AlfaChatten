var apiAPI = "707f29905464f3ff07a88f60a3ebd677";
var firstPart = 'http://words.bighugelabs.com/api/2/';
var format = '/json';
var timer;
var wordlist = $("#wordlist");

$("#messageInput").keyup(function (event) {    
    var inputBox = $(this).val();
    var markerPosition = $(this)[0].selectionStart;

    clearTimeout(timer);
    timer = setTimeout(function () {
        wordlist.empty();
        var word = getWordAt(inputBox, markerPosition);
        GetWord(word);
    }, 500);
});

function getWordAt(word, markerPosition) {   

    word = String(word);
    markerPosition = Number(markerPosition);

    var left = word.slice(0, markerPosition + 1).search(/\S+$/),
        right = word.slice(markerPosition).search(/\s/);
    if (right < 0) {
        return word.slice(left);
    }
    return word.slice(left, right + markerPosition);
}

function GetWord(searchWord) {         
    var url = firstPart + apiAPI + '/' + searchWord + format;
    $.getJSON(url, (json) => {
        $.each(json, (i, result) => {                                       //FirstLevel
            $.each(result, (typeofWord, wordArray) => {                     //SecondLevel
                printFoundSynonymes(wordArray);                             //Send the found wordlist to print
                return false;
            })
            return false;
        });
        return false;
    });
}

function printFoundSynonymes(wordArray) {

    console.log(wordArray);

    for (var i = 0; i < 3; i++) {
        wordlist.append($("<li>").text(wordArray[i]));
    }
}
