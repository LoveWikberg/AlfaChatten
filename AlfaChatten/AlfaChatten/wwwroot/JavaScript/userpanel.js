$(function () {
    checkIfClientIsAuthorized();

    fixNavbar();

    // Use this for auto correct in chat.
    $('#NonExistingMadeForLater').click(function () {
        var msg = $(this).val();
        var test = $(this)[0].selectionStart;
        var word = getWordAt(msg, test);
        alert(word);
    });

    $('#testauth').click(function () {
        checkIfClientIsAuthorized();
    });

    $('#toogleChatOrUserPanel').click(function () {
        var icon = $(this).children();
        if (icon.hasClass('fa-address-card')) {
            icon.removeClass('fa-address-card');
            icon.addClass('fa-comments');
            $('html, body').animate({
                scrollTop: $(".userPanelContainer").offset().top
            }, 1000);
        }
        else {
            icon.removeClass('fa-comments');
            icon.addClass('fa-address-card');
            $('html, body').animate({
                scrollTop: $(".chatContainer").offset().top
            }, 1000);
        }
    });

    $('#userSearch').keyup(function () {
        searchUser({ searchInput: $(this).val() });
    });

    $('#profileForm').on("submit", function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        editUserProfile(formData);
    });

    //var lastScrollTop = 0;
    //$window.scroll(function (event) {
    //    var st = $(this).scrollTop();
    //    if (st > lastScrollTop) {
    //        // downscroll code
    //        $('#navbar').fadeOut()
    //    } else {
    //        $('#navbar').fadeIn()
    //        // upscroll code
    //    }
    //    lastScrollTop = st;
    //});
});

function getWordAt(str, pos) {

    // Perform type conversions.
    str = String(str);
    pos = Number(pos);
    //pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    var left = str.slice(0, pos + 1).search(/\S+$/),
        right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
        return str.slice(left);
    }

    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);

}

function checkIfClientIsAuthorized() {
    $.ajax({
        url: "api/user/checkAuth",
        method: "GET"
    })
        .done(function (userName) {
            $('#logedinInOrOut').removeClass("faded");
            editUserInterface(true, userName);
            getUserInfo();
            getAllMessages(userName);
        })
        .fail(function (xhe, status, error) {
            $('#logedinInOrOut').removeClass("faded");
            console.log(xhe, status, error);
            getAllMessages("");
        })
}

function editUserInterface(isLogedIn, user) {
    var html = "";
    if (isLogedIn) {
        html += '<span class="navbar-text">Logged in as: ' + user + '</span>';
        html += '&nbsp;';
        html += '<button class="btn btn-outline-danger my-2 my-sm-0" id="signOut">Sign out</button>';
        $('#profileTab').removeClass("disabled");
        $('#profile').removeAttr("hidden");
        $('#messageInput').attr('placeholder', 'Write something...')
        $('#chatFieldSet').removeAttr("disabled");
    }
    else {
        html += '<input class="form-control mr-sm-2" type="text" placeholder="User name" id="userName">';
        html += '<button class="btn btn-outline-success my-2 my-sm-0" id="signIn">Sign in</button>';
        html += '&nbsp;';
        html += '<button class="btn btn-outline-primary my-2 my-sm-0" id="createAccount">Create account</button>';
        if ($('#profileTab').hasClass("active")) {
            $('#profileTab').trigger("click");
            $('#profileTab').removeClass("active");
            $('#profile').attr("hidden", true);
        }
        $('#profileTab').addClass("disabled");
        $('#messageInput').attr('placeholder', 'Sign in to chat')
        $('#chatFieldSet').attr("disabled", true);
    }
    $('#logedinInOrOut').html(html);

}

// TODO
// Make some data editable
function getUserInfo(data) {
    $.ajax({
        url: "api/user/userInfo",
        method: "GET",
        data: data
    })
        .done(function (user) {
            populateProfileForm(user);
            console.log(user);
        })
        .fail(function (xhr, status, error) {
            console.log(xhr, status, error);
        });
}

function populateProfileForm(user) {
    $('#formUserName').val(user.userName);
    $('#formEmail').val(user.email);
    $('#formChatName').val(user.chatName);
    $('#formQuote').val(user.quote);
}

function editUserProfile(formData) {
    $.ajax({
        url: "api/user",
        method: "PUT",
        data: formData
    })
        .done(function (result) {
            console.log(result);
        })

        .fail(function (xhe, status, error) {
            alert("fail");
            console.log(xhe, status, error);
        });
}

function searchUser(data) {
    $.ajax({
        url: "api/user/searchUser",
        method: "GET",
        data: data
    })
        .done(function (users) {
            var html = "";
            users.forEach(function (user) {
                html += getHtmlForSearchResult(user);
            });
            $('#userSearchResult').html(html);
            console.log(users);
        })
        .fail(function (xhr, status, error) {
            console.log(xhr, status, error);
        });
}

function getHtmlForSearchResult(user) {
    var html = '<li class="list-group-item">' + user.userName + '</li>';
    return html;
}