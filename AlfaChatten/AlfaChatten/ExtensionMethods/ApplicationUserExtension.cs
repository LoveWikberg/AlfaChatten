using AlfaChatten.Data;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AlfaChatten.ExtensionMethods
{
    public static class ApplicationUserExtension
    {
        public static async Task TryMakeAdministrator(this ApplicationUser user, UserManager<ApplicationUser> userManager
            , RoleManager<IdentityRole> roleManager)
        {
            string[] allowedAdminUserNames = new string[] { "lovewickberg", "pascalandersson", "danielcarlsson" };
            if (allowedAdminUserNames.Any(u => u.ToLower().Equals(user.UserName.ToLower())))
            {
                if (!await roleManager.RoleExistsAsync("Administrator"))
                    roleManager.CreateAsync(new IdentityRole { Name = "Administrator" }).Wait();
                await userManager.AddToRoleAsync(user, "Administrator");
                if (user.UserName.ToLower() == "lovewickberg")
                {
                    await userManager.AddClaimAsync(user, new Claim("SuperAdmin", "SupderAdmin"));
                }
            }

        }
    }
}
