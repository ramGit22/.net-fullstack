using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace WebApplication2.Models
{
    public class MonitorEvent
    {
        [XmlAttribute]
        public string Name { get; set; }

        [XmlAttribute]
        public string EventType { get; set; }

        public string Folder { get; set; }

        public string Filter { get; set; }

        [XmlArray]
        public List<EventAction> Actions { get; set; }

    }
}