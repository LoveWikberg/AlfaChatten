using AlfaChatten.Data;
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
            var info = await _signInManager.GetExternalLoginInfoAsync();
            string facebookId = info.Principal.FindFirstValue(ClaimTypes.NameIdentifier);

            var newUser = new ApplicationUser
            {
                FacebookId = facebookId,
                Email = info.Principal.FindFirstValue(ClaimTypes.Email),
                UserName = info.Principal.FindFirstValue(ClaimTypes.Email),
                Image = $"https://graph.facebook.com/{facebookId}/picture?type=large",
                DateOfBirth = info.Principal.FindFirstValue(ClaimTypes.DateOfBirth),
                Gender = info.Principal.FindFirstValue(ClaimTypes.Gender),
                LastName = info.Principal.FindFirstValue(ClaimTypes.Surname),
                FirstName = info.Principal.FindFirstValue(ClaimTypes.GivenName),
            };

            await Datamanager.CreateUser(newUser);
            await Datamanager.SignIn(newUser.UserName);

            return Content(@"<body onload='window.close();'></body>", "text/html");
        }



        [Route("/Error")]
        public IActionResult Index()
        {
            return Content(@"<body onload='window.close();'></body>", "text/html");
        }

    }
}