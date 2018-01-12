﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using AlfaChatten.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Hosting;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AlfaChatten.Controllers
{
    [Route("api/user")]
    public class UserController : Controller
    {
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly DataManager dataManager;
        private readonly IHostingEnvironment hostingEnvironment;

        public UserController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager
            , DataManager dataManager, IHostingEnvironment hostingEnvironment)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.dataManager = dataManager;
            this.hostingEnvironment = hostingEnvironment;
        }

        [Authorize, HttpDelete]
        async public Task<IActionResult> RemoveUser()
        {
            if (!string.IsNullOrEmpty(HttpContext.User.Identity.Name))
            {
                await dataManager.SignOut(HttpContext.User.Identity.Name);
                await dataManager.RemoveUser(HttpContext.User.Identity.Name);

                return Ok("User deleted.");
            }
            else
                return BadRequest("invalid username");
        }

        [Authorize, HttpPut]
        async public Task<IActionResult> EditUser(ApplicationUser user)
        {
            try
            {
                await dataManager.EditUser(user);
                return Ok($"{user.UserName} edited!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Authorize, HttpPost, Route("signOut")]
        async public Task<IActionResult> SignOut()
        {
            await dataManager.SignOut(HttpContext.User.Identity.Name);
            return Ok("Signed out..");
        }

        [HttpGet, Route("checkAuth")]
        public IActionResult CheckIfUserIsAuthorized()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
                return Ok(HttpContext.User.Identity.Name);
            else
                return Unauthorized();
        }

        [Authorize, HttpPut, Route("image")]
        async public Task<IActionResult> EditProfileImage(IFormFile image)
        {
            try
            {
                var user = await userManager.FindByNameAsync(HttpContext.User.Identity.Name);
                await dataManager.SaveProfileImageFile(image, user.Id);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Authorize, HttpGet, Route("loggedInUsersInfo")]
        async public Task<IActionResult> GetLoggedInUsersInfo()
        {
            var user = await dataManager.GetUserInfo(HttpContext.User.Identity.Name);
            return Ok(user);
        }

        [HttpGet, Route("userInfo")]
        async public Task<IActionResult> GetUserInfo(string username)
        {
            var user = await dataManager.GetUserInfo(username);
            return Ok(user);
        }

        [HttpGet, Route("searchUser")]
        public IActionResult SearchUser(string searchInput)
        {
            var users = dataManager.SearchUsers(searchInput);
            return Ok(users);
        }

        [HttpGet, Route("getAllUsers")]
        public IActionResult GetAllUsers()
        {
            var allUsersFromDb = dataManager.GetAllUsers();
            return Ok(allUsersFromDb);
        }

        #region Content needed if facebook authorization doesn't work
        //[HttpPost, Route("create")]
        //async public Task<IActionResult> CreateUser(ApplicationUser user)
        //{
        //    try
        //    {
        //        await dataManager.CreateUser(user);
        //        return Ok(user);
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //}
        //[HttpPost, Route("signIn")]
        //async public Task<IActionResult> SignIn(string userName)
        //{
        //    try
        //    {
        //        await dataManager.SignIn(userName);
        //        return Ok();
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //}
        #endregion

    }
}
