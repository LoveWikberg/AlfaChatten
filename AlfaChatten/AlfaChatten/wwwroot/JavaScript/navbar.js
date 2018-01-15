$(function () {

    $(document).on("click", "#signOut,#signOutSideNav", function () {
        signOut();
    });

    $(document).on("click", "#facebookSignin,#facebookSigninSideNav,#facebookSigninProfileTab", function () {
        openFacebookSignInPopUp();
    });

    $('#userName').keyup(function () {
        $('#logedinInOrOut').removeClass('has-danger');
        $('#userName').removeClass('form-control-danger');
    });


    $('#showNav').click(function () {
        openNav();
    });

});

var facebookPopUp;
function openFacebookSignInPopUp() {
    facebookPopUp = window.open("/facebook/ExternalLogin", "_blank", "toolbar=no,scrollbars=no,resizable=no,top=300,left=500,width=1200,height=400");
    checkIfFacebookPopupIsClosed();
}
function checkIfFacebookPopupIsClosed() {
    var facebookWindowTimer = window.setInterval(function () {
        if (facebookPopUp.closed !== false) {
            window.clearInterval(facebookWindowTimer);
            location.reload();
        }
    }, 200);
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

function openNav() {
    $('#mySidenav').css("width", "250px");
    $('#main').css("margin-right", "250px");
}

function closeNav() {
    $('#mySidenav').css("width", "0px");
    $('#main').css("margin-right", "0px");
}

// Content needed if facebook authorization doesn't work

//$(document).on("click", "#signIn", function () {
    //    var name = $('#userName').val();
    //    signIn({ userName: name });
    //});

    //$(document).on("click", "#signInSideNav", function () {
    //    var name = $('#userNameSideNav').val();
    //    signIn({ userName: name });
    //});

//function signIn(data) {
//    $.ajax({
//        url: "api/user/signIn",
//        method: "POST",
//        data: data
//    })
//        .done(function (userName) {
//            location.reload();
//        })
//        .fail(function (xhe, status, error) {
//            validateSignIn();
//            console.log(xhe, status, error);
//        });
//}

//function validateSignIn() {
//    $('#logedinInOrOut').addClass('has-danger');
//    $('#userName').addClass('form-control-danger');
//}