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

    $(document).on("click", "#signIn", function () {
        var name = $('#userName').val();
        signIn({ userName: name });
    });

    $(document).on("click", "#createAccount", function () {
        var name = $('#userName').val();
        createUser({ userName: name });
    });

    $(document).on("click", "#signOut", function () {
        signOut();
    });

    $('#testauth').click(function () {
        checkIfClientIsAuthorized();
    });

    $('#userName').keyup(function () {
        $('#logedinInOrOut').removeClass('has-danger');
        $('#userName').removeClass('form-control-danger');
    });

    $window.resize(function () {
        fixNavbar();
    });

    $('#hideNavbar').click(function () {
        $('#navbar').fadeOut();
    });

    $('#showNav').click(function () {
        //openNav();
        $('#navbar').fadeIn();
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

var $window = $(window);
function fixNavbar() {
    if ($window.width() <= 991 && !$('#navbar').hasClass('fixed-top')) {
        $('#navbar').addClass('fixed-top');
    }
    else if ($window.width() > 991 && $('#navbar').hasClass('fixed-top')) {
        $('#navbar').removeClass('fixed-top');
        $('#navbar').show();
    }
}

function createUser(data) {
    $.ajax({
        url: "api/user/create",
        method: "POST",
        data: data
    })
        .done(function (userName) {
            location.reload();
            //editUserInterface(true, data.userName);
            //getUserInfo();
            //console.log(userName);
        })
        .fail(function (xhr, status, error) {
            validateSignIn();
            alert("fail");
            console.log(xhr, status, error);
        });
}

function signIn(data) {
    $.ajax({
        url: "api/user/signIn",
        method: "POST",
        data: data
    })
        .done(function (userName) {
            location.reload();
            //editUserInterface(true, data.userName);
            //getUserInfo();
            //console.log(userName);
        })
        .fail(function (xhe, status, error) {
            validateSignIn();
            console.log(xhe, status, error);
        });
}

function signOut() {
    $.ajax({
        url: "api/user/signOut",
        method: "POST"
    })
        .done(function () {
            editUserInterface(false, " ");
        })
        .fail(function (xhe, status, error) {
            alert("fail");
            console.log(xhe, status, error);
        });
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
            console.log(userName);
        })
        .fail(function (xhe, status, error) {
            $('#logedinInOrOut').removeClass("faded");
            console.log(xhe, status, error);
        });
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

function validateSignIn() {
    $('#logedinInOrOut').addClass('has-danger');
    $('#userName').addClass('form-control-danger');
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

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}