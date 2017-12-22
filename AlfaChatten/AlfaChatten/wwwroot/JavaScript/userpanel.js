$(function () {

    $('#create').click(function () {
        alert("tja");
        createUser();
    });

    $('#login').click(function () {
        var name = $('#name').val();
        signin({ userName: name});
    });

})

function createUser() {
    $.ajax({
        url: "api/user/create",
        method: "GET"
    })
        .done(function (result) {
            alert("success");
            console.log(result);
        })
        .fail(function (xhr, status, error) {
            alert("fail");
            console.log(xhr, status, error);
        })
}

function signin(data) {
    $.ajax({
        url: "api/user/signIn",
        method: "GET",
        data: data
    })
        .done(function (result) {
            alert("removed");
            console.log(result);
        })
        .fail(function (xhe, status, error) {
            alert("fail");
            console.log(xhe, status, error);
        })
}