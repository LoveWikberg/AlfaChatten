using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlfaChatten.Hubs
{
    public class ChatHub : Hub
    {
        public void Send(string name, string message)
        {
            //Groups.AddAsync("connId", "gruppnamn");
            List<string> caller = new List<string>
            {
                Context.ConnectionId
            };
            // Call the broadcastMessage method to update clients.
            Clients.AllExcept(caller).InvokeAsync("broadcastMessage", name, message);
            //Clients.Group("asd").InvokeAsync("broadcastMessage", name, message);
        }
    }
}
