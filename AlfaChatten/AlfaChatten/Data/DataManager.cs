using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlfaChatten.Data
{
    public class DataManager
    {
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly ApplicationDbContext context;

        public DataManager(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager
            ,RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.context = context;

            context.Database.EnsureCreated();
            roleManager.CreateAsync(new IdentityRole { Name = "Administrator" }).Wait();
        }

        async public Task RemoveUser(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            await userManager.DeleteAsync(user);
        }

        async public Task SignIn(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            await signInManager.SignInAsync(user, false);
        }

        async public Task EditUser(ApplicationUser user)
        {
            var userToEdit = await userManager.FindByIdAsync(user.Id);
        }
    }
}
