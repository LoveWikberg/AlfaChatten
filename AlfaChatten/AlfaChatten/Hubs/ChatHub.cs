using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlfaChatten.Hubs
{
    public class ChatHub : Hub
    {
        public void Send(string message)
        {
            // FUNGERAR IAF I FIREFOX DEV MODE

            var identityName = Context.User.Identity.Name;
            //Groups.AddAsync("connId", "gruppnamn");
            List<string> caller = new List<string>
            {
                Context.ConnectionId
            };
            // Call the broadcastMessage method to update clients.
            Clients.AllExcept(caller).InvokeAsync("broadcastMessage", identityName, message);
            //Clients.Group("asd").InvokeAsync("broadcastMessage", name, message);
        }
    }
}
