using AlfaChatten.Data;
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
        private readonly DataManager dataManager;

        public ChatHub(DataManager dataManager)
        {
            this.dataManager = dataManager;
        }

        [Authorize]
        public void Send(string message)
        {
            if (!string.IsNullOrWhiteSpace(message))
            {
                var identityName = Context.User.Identity.Name;

                dataManager.SaveMessageToDb(identityName, message);

                List<string> caller = new List<string>
            {
                Context.ConnectionId
            };

                Clients.AllExcept(caller).InvokeAsync("broadcastMessage", identityName, message);
            }
        }
    }
}
