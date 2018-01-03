using System;

namespace AlfaChatten.Data
{
    public class Chat
    {
        public int Id { get; set; }

        public string User { get; set; }

        public string Message { get; set; }

        public DateTime TimeSent { get; set; }

    }
}