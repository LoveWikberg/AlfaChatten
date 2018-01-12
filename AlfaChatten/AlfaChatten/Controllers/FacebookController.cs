using AlfaChatten.Data;
using AlfaChatten.ExtensionMethods;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AlfaChatten.Controllers
{
    [Route("[controller]/[action]")]
    public class FacebookController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly DataManager datamanager;

        public FacebookController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, DataManager datamanager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.datamanager = datamanager;
        }

        public IActionResult ExternalLogin()
        {
            AuthenticationProperties properties = signInManager.ConfigureExternalAuthenticationProperties("Facebook", "/Facebook/ExternalLoginCallback");
            return Challenge(properties, "Facebook");
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
        {
            try
            {
                var info = await signInManager.GetExternalLoginInfoAsync();
                await datamanager.FacebookAuthorization(info);
                return Content(@"<body onload='window.close();'></body>", "text/html");
            }
            catch (Exception)
            {
                return Content(@"<body onload='window.close();'></body>", "text/html");
            }
        }

        [Route("/Error")]
        public IActionResult Index()
        {
            return Content(@"<body onload='window.close();'></body>", "text/html");
        }

    }
}