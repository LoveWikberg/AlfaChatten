using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AlfaChatten.Data;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AlfaChatten.Controllers
{
    [Route("api/messages")]
    public class MessagesController : Controller
    {
        private readonly DataManager dataManager;

        public MessagesController(DataManager dataManager)
        {
            this.dataManager = dataManager;
        }

        [HttpGet, Route("getallmessages")]
        public IActionResult GetAllMessages()
        {
            var allMessages = dataManager.GetAllChatMessagesFromDb();
            return Ok(allMessages);
        }
    }
}
