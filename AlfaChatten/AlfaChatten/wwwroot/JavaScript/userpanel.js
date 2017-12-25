$(function () {
    checkIfClientIsAuthorized();

    fixNavbar();

    $(document).on("click", "#signIn", function () {
        var name = $('#userName').val();
        signIn({ userName: name });
    });

    $(document).on("click", "#createAccount", function () {
        alert("create");
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
            editUserInterface(true, data.userName);
            console.log(userName);
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
            editUserInterface(true, data.userName);
            console.log(userName);
        })
        .fail(function (xhe, status, error) {
            validateSignIn();
            alert("fail");
            console.log(xhe, status, error);
        });
}

function signOut() {
    $.ajax({
        url: "api/user/signOut",
        method: "POST"
    })
        .done(function () {
            alert("signed out");
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
            console.log(result);
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
    }
    $('#logedinInOrOut').html(html);

}

function validateSignIn() {
    $('#logedinInOrOut').addClass('has-danger');
    $('#userName').addClass('form-control-danger');
}