using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.IO;
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
            //roleManager.CreateAsync(new IdentityRole { Name = "Administrator" }).Wait();
        }

        async public Task CreateUser(ApplicationUser user)
        {
            if (await userManager.FindByNameAsync(user.UserName) == null)
            {
                var newUser = new ApplicationUser
                {
                    UserName = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    ChatName = $"{user.FirstName} {user.LastName}"
                };
                await userManager.CreateAsync(newUser);
                await signInManager.SignInAsync(newUser, false);
            }
            else
                await SignIn(user.UserName);
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

        public string GetFileNameAndExtension(string id, string rootChildFolder)
        {
            try
            {
                string path = $"{hostingEnvironment.WebRootPath}\\{rootChildFolder}";
                //string path = Directory.GetCurrentDirectory() + @"\wwwroot\" + rootChildFolder + @"\";
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
            catch (Exception e)
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
    }
}
