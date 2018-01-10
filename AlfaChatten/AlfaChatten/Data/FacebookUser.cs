using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlfaChatten.Data
{
    public class FacebookUser
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Picture { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string SureName { get; internal set; }
        public string GivenName { get; internal set; }
    }
}
