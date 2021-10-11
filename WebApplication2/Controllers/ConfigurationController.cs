using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;
using System.Web.Services.Description;
using System.Xml;
using System.Xml.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebApplication2.Helpers;
using WebApplication2.Models;
using System.Xml.Linq;
using Formatting = Newtonsoft.Json.Formatting;


namespace WebApplication2.Controllers
{
    public class ConfigurationController : ApiController
    {
        private string ReadConfiguration()
        {
            var filePath = GetConfigFilePath();
            var doc = new XmlDocument();
            XmlReaderSettings settings = new XmlReaderSettings();
            settings.IgnoreComments = true;
            settings.CloseInput = true;

            var reader = XmlReader.Create(filePath, settings);
            doc.Load(reader);
            doc.RemoveChild(doc.FirstChild);
            
            var root = doc.DocumentElement;
            var els = root?.GetElementsByTagName("XmlEnvelope");
            
            for (int i = els.Count - 1; i >= 0; i--)
            {
                els[i].ParentNode?.RemoveChild(els[i]);
            }
            var queryNodes = root.GetElementsByTagName("Query");
            for (int i = queryNodes.Count - 1; i >= 0; i--)
            {
                queryNodes[i].ParentNode?.RemoveChild(queryNodes[i]);
            }

/*            string jsonText = JsonConvert.SerializeXmlNode(doc, Formatting.None);
            var xml = jsonText.Replace("\\", "");

            return xml;*/
            var builder = new StringBuilder();
            JsonSerializer.Create().Serialize(new CustomJsonWriter(new StringWriter(builder)), doc);
            var str =  builder.ToString().Replace("\\", "");
            reader.Close();
            reader.Dispose();
            return str;
        }

        private string GetConfigFilePath()
        {
            return HttpContext.Current.Server.MapPath("~") + "\\Config\\EventMonitor.xml";
        }

        public IHttpActionResult GetConfig()
        {
            return Json(ReadConfiguration());
        }

        public IHttpActionResult Post([FromBody] JObject data)
        {
            CreateEvent(data);
            return Ok();
        }

        public IHttpActionResult Put([FromBody] JObject data)
        {
            UpdateEvent(data);
            return Ok();
        }

        public IHttpActionResult Delete(string index)
        {
            if (string.IsNullOrEmpty(index))
                return BadRequest("Not valid index");
            var idx = Regex.Unescape(index);
            var filePath = GetConfigFilePath();
            var doc = new XmlDocument();

            doc.Load(filePath);
            var nodeList = doc.SelectNodes("/ActiveCMSMonitor/MonitorEvent");
            var nodeToDelete = nodeList?.Item(int.Parse(idx));

            if (nodeToDelete != null)
            {
                nodeToDelete.ParentNode?.RemoveChild(nodeToDelete);
            }

            WriteXml(doc, filePath);

            return Ok();
        }

        private void UpdateEventElement(MonitorEvent mEvent, string index)
        {
            var filePath = GetConfigFilePath();
            var doc = new XmlDocument();

            doc.Load(filePath);

            bool useIndex = !string.IsNullOrEmpty(index);
            var node = doc.SelectSingleNode($"/ActiveCMSMonitor/MonitorEvent[@Name='{mEvent.Name}']");

            if (useIndex)
            {
                var nodeList = doc.SelectNodes("/ActiveCMSMonitor/MonitorEvent");
                node = nodeList?.Item(int.Parse(index));
            }
                
            var prevNode = node?.PreviousSibling;
            var followingNode = node?.NextSibling;

            node?.ParentNode?.RemoveChild(node);

            var el = CreateEventElement(doc, mEvent);

            if (prevNode == null && followingNode == null)
            {
                doc?.DocumentElement?.AppendChild(el);
            }

            if (prevNode == null)
            {
                followingNode?.ParentNode?.InsertBefore(el, followingNode);
            }
            else
            {
                prevNode.ParentNode?.InsertAfter(el, prevNode);
            }
            
            WriteXml(doc, filePath);
        }

        private XmlElement CreateEventElement(XmlDocument doc, MonitorEvent mEvent)
        {
            var element = doc.CreateElement("MonitorEvent");
            var attribute = doc.CreateAttribute("xsi:type", "http://www.w3.org/2001/XMLSchema-instance");
            attribute.Value = mEvent.EventType;
            element.SetAttributeNode(attribute);
            element.SetAttribute("Name", mEvent.Name);

            var folderEl = doc.CreateElement("Folder");
            folderEl.InnerText = mEvent.Folder;
            element.AppendChild(folderEl);

            var filterEl = doc.CreateElement("Filter");
            filterEl.InnerText = mEvent.Filter;
            element.AppendChild(filterEl);

            if (mEvent.Actions.Any())
            {
                var actionsEl = doc.CreateElement("Actions");
                foreach (var action in mEvent.Actions)
                {
                    var eventActionEl = doc.CreateElement("EventAction");
                    var actionAttribute = doc.CreateAttribute("xsi:type", "http://www.w3.org/2001/XMLSchema-instance");
                    actionAttribute.Value = action.ActionType;
                    eventActionEl.SetAttributeNode(actionAttribute);

                    var emailEl = CreateElement(doc, "SupportEmail", action.SupportEmail);
                    eventActionEl.AppendChild(emailEl);
                    var emailElCc = CreateElement(doc, "SupportEmailCc", action.SupportEmailCc);
                    eventActionEl.AppendChild(emailElCc);
                    var validateEl = CreateElement(doc, "Validate", action.Validate.ToString());
                    eventActionEl.AppendChild(validateEl);
                    
                    actionsEl.AppendChild(eventActionEl);
                }

                element.AppendChild(actionsEl);
            }

            return element;
        }

        private void CreateEvent(JObject data)
        {
            var mEvent = data.ToObject<MonitorEvent>();

            var filePath = GetConfigFilePath();
            var doc = new XmlDocument();

            doc.Load(filePath);

            var el = CreateEventElement(doc, mEvent);

            doc.DocumentElement?.AppendChild(el);

            WriteXml(doc, filePath);
        }

        private void UpdateEvent(JObject data)
        {
            var mEvent = data.ToObject<MonitorEvent>();
            if (data.TryGetValue("Index", out var index))
            {
                UpdateEventElement(mEvent, index.ToString());
            }
        }

        private XmlElement CreateElement(XmlDocument doc, string elName, string elValue)
        {
            var el = doc.CreateElement(elName);
            el.InnerText = elValue;
            return el;
        }

        private void WriteXml(XmlDocument doc, string filePath)
        {
            using (var writer = new StreamWriter(filePath))
            {
                doc.Save(writer);
            }
        }
    }
}