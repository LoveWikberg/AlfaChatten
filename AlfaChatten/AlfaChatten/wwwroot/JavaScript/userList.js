$(function () {
    getAllUsers();
});

function getAllUsers() {
    $.ajax({
        url: "api/user/getAllUsers",
        method: "GET"
    })
        .done(function (allUsers) {
            var html = "";
            allUsers.forEach(function (user) {
                html += displayUser(user);
            });
            $("#usersOnlineList").html(html);
        })
        .fail(function (xhr, status, error) {
            console.log(xhr, status, error);
        });
}

function displayUser(user) {
    var html = "";
    var userImage = checkIfUserImageIsUploaded(user);

    if (user.isSignedIn === true) {
        html = '<div class="user-wrapper"><li class="user-list-item">' + userImage + "<b>" + user.userName + "</b>" + '<div class="isOnlineDot"></div></li></div>';
    } else {
        html = '<div class="user-wrapper"><li class="user-list-item">' + userImage + user.userName + '</li></div>';
    }
    return html;
}

function checkIfUserImageIsUploaded(user) {
    var userImage = "";

    if (user.image === null) {
        userImage = '<img class="userListProfilePicture" src="Images/ProfileImages/Default.png"/>';
    } else {
        userImage = '<img class="userListProfilePicture" src="Images/ProfileImages/' + user.image + '"/>';
    }
    return userImage;
}