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
        [HttpPut, Route("user")]
        async public Task<IActionResult> EditUser(ApplicationUser user)
        {
            return Ok();
        }

        [HttpDelete, Route("remove")]
        async public Task<IActionResult> RemoveUser(string userName)
        {
            return Ok($"{userName} removed");
        }

    }
}
