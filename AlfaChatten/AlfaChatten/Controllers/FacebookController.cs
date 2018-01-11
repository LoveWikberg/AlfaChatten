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
            ApplicationUser newUser = new ApplicationUser();

            var info = await _signInManager.GetExternalLoginInfoAsync();

            string facebookId = info.Principal.FindFirstValue(ClaimTypes.NameIdentifier);
            string firstName = info.Principal.FindFirstValue(ClaimTypes.GivenName);
            string lastName = info.Principal.FindFirstValue(ClaimTypes.Surname);
            string userName = firstName + lastName;
            string email = info.Principal.FindFirstValue(ClaimTypes.Email);
            string image = $"https://graph.facebook.com/{facebookId}/picture?type=large";

            if (await _userManager.FindByNameAsync(userName) == null)
            {
                newUser = new ApplicationUser
                {
                    //FacebookId = facebookId,
                    Email = email,
                    Image = image,
                    FirstName = firstName,
                    LastName = lastName,
                    //DateOfBirth = info.Principal.FindFirstValue(ClaimTypes.DateOfBirth),
                    //Gender = info.Principal.FindFirstValue(ClaimTypes.Gender),
                    UserName = "daniel",
                };

                await Datamanager.CreateUser(newUser);
            }
            else
            {
                await Datamanager.SignIn(newUser.UserName);
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