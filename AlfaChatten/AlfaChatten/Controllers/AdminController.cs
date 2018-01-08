using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AlfaChatten.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AlfaChatten.Controllers
{
    [Authorize(Roles = "Administrator"), Route("api/admin")]
    public class AdminController : Controller
    {
        private readonly DataManager dataManager;

        public AdminController(DataManager dataManager)
        {
            this.dataManager = dataManager;
        }

        [HttpPut]
        async public Task<IActionResult> EditUser(ApplicationUser user)
        {
            await dataManager.EditUser(user);
            return Ok();
        }

        [HttpDelete]
        async public Task<IActionResult> RemoveUser(string userName)
        {
            await dataManager.RemoveUser(userName);
            return Ok();
        }

    }
}
