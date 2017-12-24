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
    }
}