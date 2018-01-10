using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AlfaChatten.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string ChatName { get; set; }
        public string Quote { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        
        //Facebook
        public string Image { get; set; }
        public string FacebookId { get; set; }
        public string Name { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
    }
}