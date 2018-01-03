using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using AlfaChatten.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AlfaChatten.Controllers
{
    [Route("api/user")]
    public class UserController : Controller
    {
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly DataManager dataManager;

        public UserController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager
            , DataManager dataManager)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.dataManager = dataManager;
        }

        [HttpPost, Route("signIn")]
        async public Task<IActionResult> SignIn(string userName)
        {
            try
            {
                await dataManager.SignIn(userName);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Authorize, HttpDelete, Route("user")]
        async public Task<IActionResult> RemoveUser()
        {
            await dataManager.RemoveUser(HttpContext.User.Identity.Name);
            return Ok();
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

        [HttpPost, Route("create")]
        async public Task<IActionResult> CreateUser(string userName)
        {
            try
            {
                await dataManager.CreateUser(userName);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Authorize, HttpPost, Route("signOut")]
        async public Task<IActionResult> SignOut()
        {
            await signInManager.SignOutAsync();
            return Ok();
        }

        [HttpGet, Route("checkAuth")]
        public IActionResult TestAuth()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
                return Ok(HttpContext.User.Identity.Name);
            else
                return Unauthorized();
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

    }
}
