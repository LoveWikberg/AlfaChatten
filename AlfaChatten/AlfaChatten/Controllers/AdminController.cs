using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AlfaChatten.Data;
using Microsoft.AspNetCore.Identity;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AlfaChatten.Controllers
{
    [Authorize(Roles = "Administrator"), Route("api/admin")]
    public class AdminController : Controller
    {
        private readonly DataManager dataManager;
        private readonly UserManager<ApplicationUser> userManager;

        public AdminController(DataManager dataManager, UserManager<ApplicationUser> userManager)
        {
            this.dataManager = dataManager;
            this.userManager = userManager;
        }

        [HttpDelete]
        async public Task<IActionResult> RemoveUser(string userName)
        {
            try
            {
                var user = await userManager.FindByNameAsync(userName);
                if (await userManager.IsInRoleAsync(user, "Administrator"))
                    await dataManager.RemoveAdministrator(user);
                else
                    await userManager.DeleteAsync(user);
                return Ok();
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
