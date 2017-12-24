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

        [HttpGet, Route("signIn")]
        async public Task<IActionResult> SignIn(string userName)
        {
            await dataManager.SignIn(userName);
            return Ok("tjena signin");
        }

        [Authorize, HttpGet, Route("testauth")]
        public IActionResult TestAuth()
        {
            return Ok("authed");
        }

        [Authorize, HttpDelete, Route("user")]
        async public Task<IActionResult> RemoveUser()
        {
            await dataManager.RemoveUser(HttpContext.User.Identity.Name);
            return Ok();
        }

        [Authorize, HttpPut, Route("user")]
        async public Task<IActionResult> EditUser(ApplicationUser user)
        {
            return Ok();
        }

        [HttpGet, Route("create")]
        async public Task<IActionResult> CreateUser()
        {
            var user = await userManager.FindByNameAsync("kalle");
            //await signInManager.SignInAsync(user)
            //var user = new ApplicationUser
            //{
            //    UserName = "kalle",
            //    Email = "kalle@gmail.com",
            //    ChatName = "kalle",
            //    Quote = "Grym som fan"
            //};
            //await userManager.CreateAsync(user);
            //await userManager.AddPasswordAsync(user, "hejsan");
            //await signInManager.SignInAsync(user, true);
            return Ok(user);
        }

        [HttpGet, Route("signintest")]
        async public Task<IActionResult> Testsingin()
        {
            var user = await userManager.FindByNameAsync("kalle");
            await signInManager.SignInAsync(user, true);
            return Ok(user);
        }

    }
}
