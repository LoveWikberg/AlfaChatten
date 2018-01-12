$(function () {
    $(document).on("click", "#signIn", function () {
        var name = $('#userName').val();
        signIn({ userName: name });
    });

    $(document).on("click", "#signInSideNav", function () {
        var name = $('#userNameSideNav').val();
        signIn({ userName: name });
    });

    $(document).on("click", "#signOut,#signOutSideNav", function () {
        signOut();
    });

    //$(document).on("click", "#signOutSideNav", function () {
    //    signOut();
    //});

    $('#userName').keyup(function () {
        $('#logedinInOrOut').removeClass('has-danger');
        $('#userName').removeClass('form-control-danger');
    });


    $('#showNav').click(function () {
        openNav();
        //$('#navbar').fadeIn();
    });

});


function signIn(data) {
    $.ajax({
        url: "api/user/signIn",
        method: "POST",
        data: data
    })
        .done(function (userName) {
            location.reload();
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
        .done(function (result) {
            location.reload();
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
    $('#mySidenav').css("width", "250px");
    $('#main').css("margin-right", "250px");
    //document.getElementById("mySidenav").style.width = "250px";
    //document.getElementById("main").style.marginRight = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    $('#mySidenav').css("width", "0px");
    $('#main').css("margin-right", "0px");
    //document.getElementById("mySidenav").style.width = "0";
    //document.getElementById("main").style.marginRight = "0";
}