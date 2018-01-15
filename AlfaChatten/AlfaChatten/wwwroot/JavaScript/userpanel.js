$(function () {
    checkIfClientIsAuthorized();

    changeUserPanelHeader();

    $(document).on("click", "#usersOnlineList li", function (e) {
        e.preventDefault();
        var name = $(this).text();
        getUserInfo({ userName: name });
        $('a[href="#users"]').tab('show');
        if ($(window).width() < 769) {
            $('html, body').animate({
                scrollTop: $("#userPanelContainer").offset().top
            }, 1000);
        }
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
        $('#saveImageBtn').html('<i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i>');
        var data = new FormData();
        var files = $('#profileImage').get(0).files;
        if (files.length === 0)
            imageButtonAnimation();
        else {
            data.append('image', files[0]);
            editProfileImageAjax(data);
        }
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

    $("#profileImage").change(function () {
        readURL(this);
    });
});

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
            changeUserPanelHeader();
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
        //$('#createUserForm').attr('hidden', true);
        $('#facebookSigninProfileTab').attr("hidden", true);
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
        changeUserPanelHeader();
    }
    $('#logedinInOrOut').html(topNavhtml);
    $('#logedinInOrOutSideNav').html(sideNavhtml);

    changeUserPanelHeader();
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

    if (user.image === null)
        $('#userImagePreview').attr("src", "Images/ProfileImages/Default.png");
    else
        $('#userImagePreview').attr("src", "Images/ProfileImages/" + user.image);
}

function editUserProfile(formData) {
    $.ajax({
        url: "api/user",
        method: "PUT",
        data: formData
    })
        .done(function (result) {
            console.log(result);
            location.reload(true);
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

function imageButtonAnimation(animationClass, symbol) {
    $('#saveImageBtn').html('<i style="color:white;" class="fa ' + symbol + ' fa-1x "></i>');
    $('#saveImageBtn').removeClass("btn-outline-primary");
    $('#saveImageBtn').addClass(animationClass).one('webkitAnimationEnd...', function () {
        $(this).removeClass(animationClass);
        $('#saveImageBtn').addClass("btn-outline-primary");
        $('#saveImageBtn').html('Save image');
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
        .done(function (image) {
            console.log(image);
            imageButtonAnimation("fileUploadSuccessfull", "fa-check");
        })
        .fail(function (xhr, status, error) {
            imageButtonAnimation("fileUploadFail", "fa-times");
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
            location.reload(true);
        })
        .fail(function (xhr, status, error) {
            alert("You are not authorized to destroy this user.");
            console.log(xhr, status, error);
        });
}

function changeUserPanelHeader() {
    var profileTabValue = $('#profileTab').text();
    var html = '<h4>' + profileTabValue + '</h4>';

    $('#profileHeader').html(html);
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#userImagePreview').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// Content needed if facebook authorization doesn't work

//function createUser(data) {
//    $.ajax({
//        url: "api/user/create",
//        method: "POST",
//        data: data
//    })
//        .done(function (userName) {
//            location.reload();
//        })
//        .fail(function (xhr, status, error) {
//            alert("fail");
//            console.log(xhr, status, error);
//        });
//}

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