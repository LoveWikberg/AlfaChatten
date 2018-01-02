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
        async public void Send(string message)
        {
            if (!string.IsNullOrWhiteSpace(message))
            {
                var identityName = Context.User.Identity.Name;

                var test = Context.ConnectionId;

                List<string> caller = new List<string>
                {
                    Context.ConnectionId
                };

                await Clients.Client(caller[0]).InvokeAsync("broadcastMessageToSelf", message);

                await Clients.AllExcept(caller).InvokeAsync("broadcastMessage", identityName, message);

                dataManager.SaveMessageToDb(identityName, message);
            }
        }
    }
}
