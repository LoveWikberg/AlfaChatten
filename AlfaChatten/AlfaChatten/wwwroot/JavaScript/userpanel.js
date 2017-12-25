$(function () {
    checkIfClientIsAuthorized();

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

});

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
        html += '<a>Loged in as: ' + user + '</a>';
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