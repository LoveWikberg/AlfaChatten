$(function () {
    checkIfClientIsAuthorized();

    getAllUsers();

    // Use this for auto correct in chat.
    $('#NonExistingMadeForLater').click(function () {
        var msg = $(this).val();
        var test = $(this)[0].selectionStart;
        var word = getWordAt(msg, test);
    });

    $(document).on("click", "#usersOnlineList li", function (e) {
        e.preventDefault();
        var name = $(this).text();
        getUserInfo({ userName: name });
        $('a[href="#users"]').tab('show');
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
        $('#profileCard').attr('hidden', true);
        searchUser({ searchInput: $(this).val() });
    });

    $('#profileForm').on("submit", function (event) {
        event.preventDefault();
        var html = '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i>';
        $('#editFormSubmitBtn').html(html);
        var formData = $(this).serialize();
        editUserProfile(formData);
    });

    $(document).on('click', '#userSearchResult li', function () {
        var name = $(this).text();
        getUserInfo({ userName: name });
    });

    $(document).on("click", "#createAccount", function () {
        var name = $('#userName').val();
        createUser({ userName: name });
    });

    $('#createUserForm').on("submit", function (event) {
        event.preventDefault();
        var formData = $(this).serializeArray();
        createUser(formData);
    });

    $('#editProfileImageForm').on("submit", function (event) {
        event.preventDefault();
        var data = new FormData();
        var files = $('#profileImage').get(0).files;
        data.append('image', files[0]);
        editProfileImageAjax(data);
    });

    $('#createFirstName,#createLastName').keyup(function () {
        var firstName = $('#createFirstName').val();
        var lastName = $('#createLastName').val();
        firstName = firstName.replace(/\s/g, '');
        lastName = lastName.replace(/\s/g, '');
        $('#createUserName').val(firstName + lastName);
    });

    $("#deleteUser").click(function (event) {
        event.preventDefault();
        removeUser();
    });

    $('#sendPrivateMassage').click(function () {
        alert("This function is still in progress and can not be used.");
    });

    $('#destroyUser').click(function () {
        var user = $('#cardUserName').text();
        var deleteUser = confirm(user + " will be deleted permanently.");
        if (deleteUser)
            adminRemoveUser({ userName: user });
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
            getLoggedInUsersInfo();
            getAllMessages(userName);
        })
        .fail(function (xhe, status, error) {
            $('#logedinInOrOut').removeClass("faded");
            console.log(xhe, status, error);
            getAllMessages("");
        });
}

function editUserInterface(isLogedIn, user) {
    var topNavhtml = "";
    var sideNavhtml = "";
    if (isLogedIn) {
        topNavhtml = topNavBarHtml(user);
        sideNavhtml = sideNavBarHtml(user);
        $('#editProfileContent').attr('hidden', false);
        $('#createUserForm').attr('hidden', true);
        $('#profileTab').text("Profile");
        $('#messageInput').attr('placeholder', 'Write something...');
        $('#chatFieldSet').removeAttr("disabled");
    }
    else {
        topNavhtml += '<input class="form-control mr-sm-2" type="text" placeholder="User name" id="userName">';
        topNavhtml += '<button class="btn btn-outline-success my-2 my-sm-0" id="signIn">Sign in</button>';
        topNavhtml += '&nbsp;';
        topNavhtml += '<button class="btn btn-outline-primary my-2 my-sm-0" id="createAccount">Create account</button>';
        $('#messageInput').attr('placeholder', 'Sign in to chat');
        $('#chatFieldSet').attr("disabled", true);
    }
    $('#logedinInOrOut').html(topNavhtml);
    $('#logedinInOrOutSideNav').html(sideNavhtml);
}

function topNavBarHtml(user) {
    var html = "";
    html += '<span class="navbar-text">Logged in as: ' + user + '</span>';
    html += '&nbsp;';
    html += '<button class="btn btn-outline-danger my-2 my-sm-0" id="signOut">Sign out</button>';
    return html;
}

function sideNavBarHtml(user) {
    var html = "";
    html += '<span class="navbar-text">Logged in as: ' + user + '</span>';
    html += '&nbsp;';
    html += '<button class="btn btn-outline-danger my-2 my-sm-0" id="signOutSideNav">Sign out</button>';
    return html;
}

function getLoggedInUsersInfo(data) {
    $.ajax({
        url: "api/user/loggedInUsersInfo",
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

function getUserInfo(data) {
    $.ajax({
        url: "api/user/userInfo",
        method: "GET",
        data: data
    })
        .done(function (user) {
            console.log(user);
            generateProfileCard(user);
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
        })
        .always(function () {
            $('#editFormSubmitBtn').html("Submit");
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

function generateProfileCard(user) {
    $('#userSearchResult').empty();
    if (user.image === null)
        $('#profileCard img').attr('src', 'Images/ProfileImages/Default.png');
    else
        $('#profileCard img').attr('src', 'Images/ProfileImages/' + user.image + '');
    $('#cardUserName').text(user.userName);
    $('#cardQuote').text(user.quote);
    $('#profileCard').attr('hidden', false);
}


function createUser(data) {
    $.ajax({
        url: "api/user/create",
        method: "POST",
        data: data
    })
        .done(function (userName) {
            location.reload();
        })
        .fail(function (xhr, status, error) {
            alert("fail");
            console.log(xhr, status, error);
        });
}

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
    var userImage = ""; 
        if (user.image === null) {
            userImage = 'Images/ProfileImages/Default.png';
        } else {
            userImage = '<img class="userListProfilePicture" id="#test" src="Images/ProfileImages/' + user.image + '"/>'; 
        }

    if (user.isSignedIn === true) {
        html = '<li class="user-list-item">' + userImage + "<b>" + user.userName + "</b>" + '<div class="isOnlineDot"></div></li>';
    }
    else {
        html = '<li class="user-list-item">' + userImage + user.userName + '</li>';
    }
    return html;
}

function editProfileImageAjax(data) {
    $.ajax({
        url: "api/user/image",
        method: "PUT",
        contentType: false,
        processData: false,
        data: data
    })
        .done(function (image) {
            console.log(image);
        })
        .fail(function (xhr, status, error) {
            alert("fail");
            console.log(xhr, status, error);
        });
}

function removeUser() {
    $.ajax({
        url: "api/user",
        method: "DELETE"
    })
        .done(function (result) {
            console.log(result);
            location.reload(true);
        })
        .fail(function (xhr, status, error) {
            alert("fail");
            console.log(xhr, status, error);
        });
}

function adminRemoveUser(data) {
    $.ajax({
        url: "api/admin",
        method: "DELETE",
        data: data
    })
        .done(function (result) {
            console.log(result);
        })
        .fail(function (xhr, status, error) {
            alert("Only administrators are alowed to destroy other users.");
            console.log(xhr, status, error);
        });
}

