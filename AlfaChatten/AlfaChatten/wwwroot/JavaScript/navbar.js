$(function () {
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
            location.reload();
            //editUserInterface(false, " ");
        })
        .fail(function (xhe, status, error) {
            alert("fail");
            console.log(xhe, status, error);
        });
}

function validateSignIn() {
    $('#logedinInOrOut').addClass('has-danger');
    $('#userName').addClass('form-control-danger');
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