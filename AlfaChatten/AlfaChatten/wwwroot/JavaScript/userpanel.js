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
        $('#profileCard').attr('hidden', true);
        searchUser({ searchInput: $(this).val() });
    });

    $('#profileForm').on("submit", function (event) {
        event.preventDefault();
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


    // LOVE FIXA DET HÄR
    // PROFILBILD SKA BARA GÅ ATT ÄNDRA EFTER ATT MAN HAR SKAPAT ANVÄNDARE
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
        })
}

function editUserInterface(isLogedIn, user) {
    var html = "";
    if (isLogedIn) {
        html += '<span class="navbar-text">Logged in as: ' + user + '</span>';
        html += '&nbsp;';
        html += '<button class="btn btn-outline-danger my-2 my-sm-0" id="signOut">Sign out</button>';

        $('#editProfileContent').attr('hidden', false);
        $('#createUserForm').attr('hidden', true);

        //$('#profileTab').removeClass("disabled");
        //$('#profile').removeAttr("hidden");
        $('#messageInput').attr('placeholder', 'Write something...')
        $('#chatFieldSet').removeAttr("disabled");
    }
    else {
        html += '<input class="form-control mr-sm-2" type="text" placeholder="User name" id="userName">';
        html += '<button class="btn btn-outline-success my-2 my-sm-0" id="signIn">Sign in</button>';
        html += '&nbsp;';
        html += '<button class="btn btn-outline-primary my-2 my-sm-0" id="createAccount">Create account</button>';
        //if ($('#profileTab').hasClass("active")) {
        //    $('#profileTab').trigger("click");
        //    $('#profileTab').removeClass("active");
        //    $('#profile').attr("hidden", true);
        //}
        //$('#profileTab').addClass("disabled");
        $('#messageInput').attr('placeholder', 'Sign in to chat')
        $('#chatFieldSet').attr("disabled", true);
    }
    $('#logedinInOrOut').html(html);

}

// TODO
// Make some data editable
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
        $('#profileCard img').attr('src', 'Images/ProfileImages/Default.png')
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

function editProfileImageAjax(data) {
    $.ajax({
        url: "api/user/image",
        method: "PUT",
        contentType: false,
        processData: false,
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

function removeUser() {
    $.ajax({
        url: "api/user",
        method: "DELETE",
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

