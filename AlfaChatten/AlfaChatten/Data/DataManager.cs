﻿using AlfaChatten.ExtensionMethods;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AlfaChatten.Data
{
    public class DataManager
    {
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly ApplicationDbContext context;
        private readonly IHostingEnvironment hostingEnvironment;

        public DataManager(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager
            , RoleManager<IdentityRole> roleManager, ApplicationDbContext context
            , IHostingEnvironment hostingEnvironment)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.context = context;
            this.hostingEnvironment = hostingEnvironment;
            context.Database.EnsureCreated();
        }

        async public Task CreateUser(ApplicationUser user)
        {
            await userManager.CreateAsync(user);
            await SignIn(user.UserName);
            await user.TryMakeAdministrator(userManager, roleManager);
        }

        [Authorize(Policy = "RemoveAdmin")]
        public async Task RemoveAdministrator(ApplicationUser user)
        {
            await userManager.DeleteAsync(user);
        }
        async public Task RemoveUser(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            await signInManager.SignOutAsync();
            await userManager.DeleteAsync(user);
        }

        async public Task SignIn(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            await signInManager.SignInAsync(user, false);
            user.IsSignedIn = true;
            await userManager.UpdateAsync(user);
        }

        async public Task SignOut(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            await signInManager.SignOutAsync();
            user.IsSignedIn = false;
            await userManager.UpdateAsync(user);
        }

        async public Task EditUser(ApplicationUser user)
        {
            var userToEdit = await userManager.FindByNameAsync(user.UserName);
            userToEdit.ChatName = user.ChatName;
            userToEdit.Quote = user.Quote;
            userToEdit.UserName = user.UserName;
            await userManager.UpdateAsync(userToEdit);
        }

        async public Task<ApplicationUser> GetUserInfo(string userName)
        {
            var user = await userManager.FindByNameAsync(userName);
            user.Image = GetFileNameAndExtension(user.Id, @"Images\ProfileImages");
            return user;
        }

        public ApplicationUser[] SearchUsers(string searchInput)
        {
            var searchResult = userManager.Users.Where(u => u.UserName.Contains(searchInput)).ToArray();
            return searchResult;
        }

        public void SaveMessageToDb(string userName, string message)
        {
            Chat chat = new Chat
            {
                User = userName,
                Message = message,
                TimeSent = DateTime.Now
            };

            context.Chat.Add(chat);
            context.SaveChanges();
        }

        public List<Chat> GetAllChatMessagesFromDb()
        {
            var chat = context.Chat.OrderBy(c => c.TimeSent).ToList();
            return chat;
        }

        string GetFileNameAndExtension(string id, string rootChildFolder)
        {
            try
            {
                string path = $"{hostingEnvironment.WebRootPath}\\{rootChildFolder}";
                string[] dir = Directory.GetFiles(path, id + "*");
                //If the the dir-array contains more than one element, find the file that match the id-variable.
                for (int i = 0; i < dir.Length; i++)
                {
                    string fileName = Path.GetFileName(dir[i]);
                    string[] fileNameSplit = fileName.Split('.');
                    if (fileNameSplit[0] == id)
                    {
                        string extension = Path.GetExtension(dir[i]);
                        return $"{id}{extension}";
                    }
                }
                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        async public Task SaveProfileImageFile(IFormFile image, string id)
        {
            var uploads = Path.Combine(hostingEnvironment.WebRootPath, @"Images\ProfileImages");
            if (image.Length > 0)
            {
                var filePath = Path.Combine(uploads, $"{id}{Path.GetExtension(image.FileName)}");
                RemoveExistingImage(uploads, id);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }
            }
        }

        void RemoveExistingImage(string path, string fileName)
        {
            var files = Directory.GetFiles(path).ToList();
            foreach (var file in files)
            {
                if (file.Contains(fileName))
                {
                    File.Delete(file);
                    break;
                }
            }
        }

        public ApplicationUser[] GetAllUsersWithImages()
        {
            var allUsers = userManager.Users.ToArray();

            for (int i = 0; i < allUsers.Length; i++)
            {
                allUsers[i].Image = GetFileNameAndExtension(allUsers[i].Id, @"Images\ProfileImages");
            }

            return allUsers;
        }

        ApplicationUser SetUserInfo(ExternalLoginInfo info)
        {
            string facebookId = info.Principal.FindFirstValue(ClaimTypes.NameIdentifier);
            string firstName = info.Principal.FindFirstValue(ClaimTypes.GivenName);
            string lastName = info.Principal.FindFirstValue(ClaimTypes.Surname);
            string userName = firstName + lastName;
            userName = userName.ReplaceSwedishCharactersAndRemoveWhiteSpaces();
            string email = info.Principal.FindFirstValue(ClaimTypes.Email);
            string image = $"https://graph.facebook.com/{facebookId}/picture?type=large";

            ApplicationUser userInfo = new ApplicationUser
            {
                UserName = userName,
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                Image = image
            };
            return userInfo;
        }

        async public Task FacebookAuthorization(ExternalLoginInfo info)
        {
            var user = SetUserInfo(info);

            // TODO
            // If a new user create an account with the same name as an existing user
            // he/she will log in with the existing account. Fix an error handler for this.
            // I.E check email instead of username since emails are unique.
            if (await userManager.FindByNameAsync(user.UserName) == null)
            {
                await CreateUser(user);
            }
            else
            {
                await SignIn(user.UserName);
            }
        }
    }
}
