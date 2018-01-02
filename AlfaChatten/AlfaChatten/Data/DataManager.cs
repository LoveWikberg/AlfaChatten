﻿using Microsoft.AspNetCore.Identity;
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
            , RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.context = context;

            context.Database.EnsureCreated();
            //roleManager.CreateAsync(new IdentityRole { Name = "Administrator" }).Wait();
        }

        async public Task CreateUser(string userName)
        {
            if (await userManager.FindByNameAsync(userName) == null)
            {
                var newUser = new ApplicationUser
                {
                    UserName = userName,
                    ChatName = userName,
                    Email = $"{userName}@gmail.com"
                };
                await userManager.CreateAsync(newUser);
                await signInManager.SignInAsync(newUser, false);
            }
            else
                throw new Exception("User name is taken");
        }

        async public Task RemoveUser(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            await userManager.DeleteAsync(user);
        }

        async public Task SignIn(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            if (user != null)
                await signInManager.SignInAsync(user, false);
            else
                throw new Exception("Invalid user name");
        }

        async public Task EditUser(ApplicationUser user)
        {
            var userToEdit = await userManager.FindByNameAsync(user.UserName);
            userToEdit.ChatName = user.ChatName;
            userToEdit.Quote = user.Quote;
            await userManager.UpdateAsync(userToEdit);
        }

        async public Task<ApplicationUser> GetUserInfo(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            return user;
        }

        public ApplicationUser[] SearchUsers(string searchInput)
        {
            var searchResult = userManager.Users.Where(u => u.UserName.Contains(searchInput)).ToArray();
            return searchResult;
        }

        async public void SaveMessageToDb(string userName, string message)
        {
            Chat chat = new Chat
            {
                User = userName,
                Message = message
            };

            context.Chat.Add(chat);
            await context.SaveChangesAsync();
        }

    }
}
