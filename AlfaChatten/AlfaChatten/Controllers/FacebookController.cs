using AlfaChatten.Data;
using AlfaChatten.ExtensionMethods;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AlfaChatten.Controllers
{
    [Route("[controller]/[action]")]
    public class FacebookController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public DataManager Datamanager { get; }

        public FacebookController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, DataManager datamanager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            Datamanager = datamanager;
        }

        public IActionResult ExternalLogin()
        {
            AuthenticationProperties properties = _signInManager.ConfigureExternalAuthenticationProperties("Facebook", "/Facebook/ExternalLoginCallback");
            return Challenge(properties, "Facebook");
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
        {
            ApplicationUser newUser = new ApplicationUser();

            var info = await _signInManager.GetExternalLoginInfoAsync();
            string facebookId = info.Principal.FindFirstValue(ClaimTypes.NameIdentifier);
            string firstName = info.Principal.FindFirstValue(ClaimTypes.GivenName);
            string lastName = info.Principal.FindFirstValue(ClaimTypes.Surname);
            string userName = firstName + lastName;
            string email = info.Principal.FindFirstValue(ClaimTypes.Email);
            string image = $"https://graph.facebook.com/{facebookId}/picture?type=large";

            userName = userName.ConvertToEnglishAlphabetAndRemoveWhiteSpaces();

            if (await _userManager.FindByNameAsync(userName) == null)
            {
                newUser = new ApplicationUser
                {
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    UserName = firstName + lastName,
                };
                await Datamanager.CreateUser(newUser);
            }

            else if (_userManager.FindByNameAsync(userName) != null)
            {
                await Datamanager.SignIn(userName);
            }

            return Content(@"<body onload='window.close();'></body>", "text/html");
        }

        [Route("/Error")]
        public IActionResult Index()
        {
            return Content(@"<body onload='window.close();'></body>", "text/html");
        }

    }
}