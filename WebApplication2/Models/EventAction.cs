using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication2.Models
{
    public class EventAction
    {
        public string ActionType { get; set; }
        public string SupportEmail { get; set; }

        public string SupportEmailCc { get; set; }

        public bool Validate { get; set; }

    }
}