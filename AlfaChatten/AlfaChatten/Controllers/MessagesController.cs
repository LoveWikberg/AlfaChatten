using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AlfaChatten.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AlfaChatten.Controllers
{
    [Route("api/messages")]
    public class MessagesController : Controller
    {
        private readonly DataManager dataManager;
        private readonly ApplicationDbContext context;

        public MessagesController(DataManager dataManager, ApplicationDbContext context)
        {
            this.dataManager = dataManager;
            this.context = context;
        }

        [HttpGet, Route("allmessages")]
        public IActionResult GetAllMessages()
        {
            var allMessages = dataManager.GetAllChatMessagesFromDb();
            return Ok(allMessages);
        }

        [Authorize(Roles = "Administrator"), HttpDelete]
        public IActionResult DeleteMessage(string id)
        {
            context.DeleteMessage(id);
            return Ok();
        }
    }
}
